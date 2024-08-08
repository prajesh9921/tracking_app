import React from "react";
import styles from "./challengeCard.module.css";
import ProgressBar from "@ramonak/react-progress-bar";
import { FiEdit3 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setEditData, statusChallenge } from "../../Store/store";
import { formatDate } from "../../helper";

const ChallengeCard = ({ itemData, open, hidebtn = false }) => {
  const ChallengesData = useSelector(
    (state: any) => state.challenges.challenges
  );
  const dispatch = useDispatch();

  const getChallengePercentage = () => {
    let count = 0;
    let totalCount = 0;
    ChallengesData.map((item) => {
      if (item.id === itemData.id) {
        totalCount += 1;
        if (item.status !== "active") {
          count++;
        }
      }
    });
    const res = (count / totalCount) * 100;
    return Math.floor(res).toString();
  };

  const handleEdit = () => {
    open();
    dispatch(setEditData({ itemdata: itemData }));
  };

  const handleComplete = () => {
    const updatedArray = ChallengesData.map(item => {
      if (item.id === itemData.id && formatDate(item.date) === formatDate(itemData.date)) {
        return {
          ...item,
          status: "completed"
        };
      }
      return item;
    });

    console.log(updatedArray);
    dispatch(statusChallenge(updatedArray));
  };

  const handleMissed = () => {
    const updatedArray = ChallengesData.map(item => {
      if (item.id === itemData.id && formatDate(item.date) === formatDate(itemData.date)) {
        return {
          ...item,
          status: "missed"
        };
      }
      return item;
    });

    dispatch(statusChallenge(updatedArray));
  };

  return (
    <div className={styles.container}>
      <div className={styles.editdiv}>
        <div>
          <p className={styles.title}>{itemData.title}</p>
          <p>{itemData.description}</p>
        </div>

        <FiEdit3 size={24} style={{ cursor: "pointer" }} onClick={handleEdit} />
      </div>

      <div className={styles.bottomdiv}>
        <div>
          <p className={styles.progresslabeldiv}>
            <span>{itemData.startdate}</span> <span>{itemData.enddate}</span>
          </p>
          <ProgressBar
            completed={getChallengePercentage()}
            className={styles.progress}
          />
        </div>

        {hidebtn ? <p className={styles.datedis}>{formatDate(itemData.date)}</p> : null}

        {/* Buttons */}
        {!hidebtn ? (
          <div className={styles.actionbtn}>
            <button
              disabled={itemData.status === "completed" ? true : false}
              onClick={handleComplete}
              className={styles.containedbutton}
            >
              {itemData.status === "completed" ? "Completed" : "Mark Complete"}
            </button>
            <button
              disabled={itemData.status === "missed" ? true : false}
              onClick={handleMissed}
              className={styles.outlinedbutton}
            >
              {itemData.status === "missed" ? `You've missed` : "Missed"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChallengeCard;
