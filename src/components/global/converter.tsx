"use client";

import { useState, useEffect } from "react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import InspectModule from "docxtemplater/js/inspect-module";
import { saveAs } from "file-saver";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { format } from "date-fns";
import TextArea from "@/src/components/global/text-area";
import { cn } from "@/src/lib/utils";
import { toast } from "sonner";

export default function Home() {
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [fields, setFields] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, string>>({});
  const [windowWidth, setWindowWidth] = useState(1024);
  const [meetingDate, setMeetingDate] = useState<Dayjs | null>(dayjs());
  const [meetingTime, setMeetingTime] = useState<Date | null>(new Date());
  const [submitted, setSubmitted] = useState(false);

  const DefaultValues: Record<string, string> = {
    venue: "BIR Conference Room",
    today_date: dayjs().format("YYYY-MM-DD"),
    year: dayjs().format("YYYY"),
    meeting_date: dayjs().format("YYYY-MM-DD"),
    meeting_time: format(new Date(), "hh:mm a"),
  };

  //Track screen size for responsive threshold
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Upload and inspect template fields
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTemplateFile(file);

      const arrayBuffer = await file.arrayBuffer();
      const zip = new PizZip(arrayBuffer);

      const inspectModule = new InspectModule();
      new Docxtemplater(zip, { modules: [inspectModule] });

      const tags = inspectModule.getAllTags();
      const fieldList = Object.keys(tags);

      setFields(fieldList);

      const initialData: Record<string, string> = {};
      fieldList.forEach((field) => {
        initialData[field] = "";
      });
      setData(initialData);

      //If template has meeting_date/time fields, pre-fill them
      if (fieldList.includes("meeting_date")) {
        const nowDate = dayjs();
        setMeetingDate(nowDate);
        initialData["meeting_date"] = nowDate.format("YYYY-MM-DD");
      }
      if (fieldList.includes("meeting_time")) {
        const nowTime = new Date();
        setMeetingTime(nowTime);
        initialData["meeting_time"] = format(nowTime, "hh:mm a");
      }
      if (fieldList.includes("venue")) {
        initialData["venue"] = "BIR Conference Room";
      }
      setData(initialData);
    }
  };

  // Update generic field
  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  //Generate DOCX
  const handleGenerate = async () => {
    if (!templateFile) return;

    const missingFields: string[] = [];

    fields.forEach((field) => {
      const value = data[field]?.trim();
      const hasDefault = DefaultValues.hasOwnProperty(field);
      if (!value && !hasDefault) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      toast("Error", {
        description: `All Field are required`,
      });
      setSubmitted(true);
      return;
    }

    const finalData: Record<string, string> = {};
    fields.forEach(
      (field) =>
        (finalData[field] = data[field]?.trim() || DefaultValues[field] || "")
    );
    toast("Downloading", {
      description: `Check your download folder for file`,
    });

    const arrayBuffer = await templateFile.arrayBuffer();
    const zip = new PizZip(arrayBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // ✅ Fill data + auto-fill today_date and year

    doc.setData({
      ...data,
      today_date: dayjs().format("YYYY-MM-DD"),
      year: dayjs().format("YYYY"),
    });

    try {
      doc.render();
    } catch (error) {
      console.error(error);
      toast("Error generating documnt", {
        description: "Please try again",
      });
      alert("Error rendering document: " + error);
      return;
    }

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    saveAs(blob, `ABIA_ISR_MEMO.docx`);

    console.log("downloading");
    const clearedData: Record<string, string> = { ...data };
    fields.forEach((field) => {
      if (!DefaultValues.hasOwnProperty(field)) {
        clearedData[field] = "";
      } else {
        clearedData[field] = DefaultValues[field];
      }
    });
    setData(clearedData);
    setSubmitted(false);
  };

  return (
    <section className="flex max-w-[35rem] h-min sm:h-full sm:max-h-[38rem] bg-white rounded-lg sm:p-5 py-4 px-3 flex-col justify-between w-full gap-y-4">
      <h2 className="text-preset-1">
        {!fields.length ? "Input Your File" : "Fill the form"}
      </h2>

      {/* ✅ Upload input */}
      <input
        type="file"
        accept=".docx"
        onChange={handleUpload}
        className={cn(
          "file:mr-4 file:h-12 w-min rounded-md truncate file:px-4 bg-purple-300 file:bg-black file:text-white text-white file:text-preset-4 file:rounded-md",
          { "self-center": !fields.length }
        )}
      />

      {/* ✅ Dynamic Form */}
      <div
        className={cn(
          "flex flex-col max-h-[26.3rem] gap-y-2 overflow-y-auto h-full",
          {
            hidden: !fields.length,
          }
        )}
      >
        {fields.map((field) => {
          const value = data[field] || "";

          // ✅ Skip today_date and year
          if (field === "today_date" || field === "year") return null;

          // ✅ Responsive threshold
          const threshold = windowWidth < 768 ? 20 : 50;
          const isLongField =
            ["body", "message", "description", "purpose", "note"].some(
              (keyword) => field.toLowerCase().includes(keyword)
            ) || value.length > threshold;

          return (
            <div key={field} className=" flex flex-col gap-y-1">
              <label htmlFor={field} className="text-preset-4">
                {field}
              </label>

              {field === "meeting_date" ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={meetingDate}
                    onChange={(val) => {
                      if (val) {
                        setMeetingDate(val as Dayjs);
                        const value = dayjs(val);
                        handleChange(field, value?.format("YYYY-MM-DD") ?? "");
                      }
                    }}
                    slotProps={{
                      textField: {
                        placeholder: "YYYY-MM-DD",
                        sx: {
                          "& .css-vycme6-MuiPickersInputBase-root-MuiPickersOutlinedInput-root":
                            {
                              height: "2.75rem",
                              backgroundColor: "",
                              color: "black",
                              borderRadius: "0.5rem",
                            },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : field === "meeting_time" ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    value={meetingTime}
                    onChange={(val) => {
                      setMeetingTime(val as Date);

                      handleChange(
                        field,
                        val ? format(val as Date, "hh:mm a") : ""
                      );
                    }}
                    slotProps={{
                      textField: {
                        placeholder: "HH:MM",
                        sx: {
                          "& .css-vycme6-MuiPickersInputBase-root-MuiPickersOutlinedInput-root":
                            {
                              height: "2.75rem",
                              backgroundColor: "",
                              color: "black",
                              borderRadius: "0.5rem",
                            },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : isLongField ? (
                <TextArea
                  value={value}
                  onChange={(e) =>
                    handleChange(field, e.target.value.toString().trim())
                  }
                  className="w-full"
                />
              ) : (
                <Input
                  id={field}
                  placeholder={field}
                  value={value}
                  onChange={(e) =>
                    handleChange(field, e.target.value.toString().trim())
                  }
                  className={cn(
                    "border-black/30 hover:border-black h-11 w-full",
                    {
                      "border-red-500":
                        !data[field] && !DefaultValues[field] && submitted,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ Generate button */}
      <Button
        onClick={handleGenerate}
        disabled={!fields.length ? true : false}
        className="h-12 text-preset-4 text-white"
      >
        Generate File
      </Button>
    </section>
  );
}
