import React, { useState, FC, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import styles from "./dialog.module.css";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { addChallenge, updateChallenge } from "../../../Store/store";

// Define types for props
interface DialogBoxProps {
  open: boolean;
  close: () => void;
  status: boolean;
}

// Define types for form data and errors
interface FormData {
  title: string;
  description: string;
  startdate: string;
  enddate: string;
  frequency: string;
}

interface FormError {
  title: string;
  description: string;
  startdate: string;
  enddate: string;
  frequency: string;
}

const DialogBox: FC<DialogBoxProps> = ({ open, close, status }) => {
  const ChallengesData = useSelector(
    (state: any) => state.challenges.challenges
  );
  const EditData = useSelector((state: any) => state.challenges.editData);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextDay = tomorrow.toISOString().split("T")[0];

  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startdate: formattedDate,
    enddate: nextDay,
    frequency: "Daily",
  });

  useEffect(() => {
    if (EditData) {
      setFormData({
        title: EditData.title || "",
        description: EditData.description || "",
        startdate: EditData.startdate || formattedDate,
        enddate: EditData.enddate || nextDay,
        frequency: EditData.frequency || "Daily",
      });
    } 
  }, [EditData]);

  const [error, setError] = useState<FormError>({
    title: "",
    description: "",
    startdate: "",
    enddate: "",
    frequency: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  function generateFourDigitNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

  function getAllDatesArray(startDate, endDate) {
    let dateArray = [];
    let currentDate = new Date(startDate);
    const id = generateFourDigitNumber();

    while (currentDate <= new Date(endDate)) {
      dateArray.push({
        id: id,
        title: formData.title,
        description: formData.description,
        startdate: formData.startdate,
        enddate: formData.enddate,
        frequency: formData.frequency,
        date: new Date(currentDate).toISOString(),
        status: "active",
      });
      currentDate.setDate(currentDate.getDate() + (formData.frequency.toLowerCase() === "daily" ? 1 : 7));
    }

    return dateArray;
  }

  const handleSubmit = () => {
    const newError: FormError = {
      title: "",
      description: "",
      startdate: "",
      enddate: "",
      frequency: "",
    };

    if (!formData.title) {
      newError.title = "Title is required";
    }
    if (!formData.description) {
      newError.description = "Description is required";
    }
    if (
      formData.startdate &&
      formData.enddate &&
      new Date(formData.enddate) < new Date(formData.startdate)
    ) {
      newError.enddate = "End date cannot be before start date";
    }

    setError(newError);

    if (
      !newError.title &&
      !newError.description &&
      !newError.startdate &&
      !newError.enddate
    ) {
      const res = getAllDatesArray(formData.startdate, formData.enddate)

      if (EditData) {
        const filteredData = ChallengesData.filter(item => item?.id !== EditData?.id);
        const finalarray = filteredData.concat(res);
        dispatch(updateChallenge(finalarray));
      } else {
        console.log("Created data");
        dispatch(addChallenge(res));
      }
      close();
    }
  };

  return (
    <Dialog onClose={close} open={status}>
      <div className={styles.container}>
        <TextField
          className={styles.textfield}
          id="outlined-basic"
          label="Title"
          variant="outlined"
          name="title"
          onChange={handleChange}
          error={Boolean(error.title)}
          helperText={error.title}
          value={formData.title}
        />
        <TextField
          className={styles.textfield}
          id="outlined-multiline-static"
          label="Description"
          variant="outlined"
          multiline
          rows={4}
          name="description"
          onChange={handleChange}
          error={Boolean(error.description)}
          helperText={error.description}
          value={formData.description}
        />
        <TextField
          type="date"
          className={styles.textfield}
          id="outlined-basic"
          label="Start Date"
          variant="outlined"
          value={formData.startdate}
          name="startdate"
          onChange={handleChange}
          error={Boolean(error.startdate)}
          helperText={error.startdate}
        />
        <TextField
          type="date"
          className={styles.textfield}
          id="outlined-basic"
          label="End Date"
          variant="outlined"
          value={formData.enddate}
          name="enddate"
          onChange={handleChange}
          error={Boolean(error.enddate)}
          helperText={error.enddate}
        />
        <Select
          id="demo-simple-select"
          className={styles.textfield}
          onChange={handleChange}
          value={formData.frequency}
          name="frequency"
        >
          <MenuItem disabled>Select the option</MenuItem>
          <MenuItem value="Weekly">Weekly</MenuItem>
          <MenuItem value="Daily">Daily</MenuItem>
        </Select>

        <div className={styles.actionbtndiv}>
          <Button
            onClick={handleSubmit}
            className={styles.btn}
            variant="contained"
          >
            {EditData ? "Edit Challenge" : "Create Challenge"}
          </Button>

          <Button
            onClick={close}
            className={styles.cancelbtn}
            variant="outlined"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default DialogBox;
