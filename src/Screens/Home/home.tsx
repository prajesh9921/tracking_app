import React, { useEffect, useState } from "react";
import styles from "./home.module.css";
import ChallengeCard from "../../Components/ChallengeCard/challengeCard";
import DialogBox from "../../Components/ChallengeCard/Dialog/dialog";
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { formatDate } from "../../helper";
import { clearEditData, updateChallenge } from "../../Store/store";
import Image from "../../assets/img.png";

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();

  const ChallengesData = useSelector(
    (state: any) => state.challenges.challenges
  );

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("0");
  const [listData, setListData] = useState([]);

  const open = () => setOpenDialog(true);
  const close = () => {
    dispatch(clearEditData());
    setOpenDialog(false);
  };

  const handleAddChallenge = () => {
    open();
  };

  const ShowActiveChallenges = () => {
    const today = formatDate(new Date());
    const temp = ChallengesData.filter(
      (item) => formatDate(item?.date) === today
    );

    return temp;
  };

  const showAllCompletedChallenges = () => {
    const filteredData = ChallengesData.filter(
      (item) => item.status === "completed"
    );
    setListData(filteredData);
  };

  const showAllMissedChallenges = () => {
    const filteredData = ChallengesData.filter(
      (item) => item.status === "missed"
    );
    setListData(filteredData);
  };

  const handleFilterChange = (val: string) => {
    setSelectedFilter(val);
    if (val === "0") {
      const res = ShowActiveChallenges();
      setListData(res);
    } else if (val === "1") {
      showAllCompletedChallenges();
    } else if (val === "2") {
      showAllMissedChallenges();
    }
  };

  function isKeyInLocalStorage(key: any) {
    return localStorage.getItem(key) !== null;
  }

  async function getData() {
    const result = ShowActiveChallenges();
    setListData(result);
  }

  function updateChallengeStatusCPM() {
    const temp = ChallengesData;

    const today = new Date().toISOString().split("T")[0];

    const resultarr = temp.map((challenge) => {
      const challengeDate = new Date(challenge.date)
        .toISOString()
        .split("T")[0];

      if (challengeDate < today && challenge.status === "active") {
        return {
          ...challenge,
          status: "missed",
        };
      }

      return challenge;
    });

    dispatch(updateChallenge(resultarr));
  }

  useEffect(() => {
    const keyToCheck = "chllangedata";
    if (isKeyInLocalStorage(keyToCheck)) {
      getData();
    } else {
      localStorage.setItem(keyToCheck, JSON.stringify({ data: [] }));
    }
  }, [ChallengesData]);

  useEffect(() => {
    updateChallengeStatusCPM();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <p className={styles.heading}>Challenge Tracker</p>
      </div>

      <div className={styles.topbtndiv}>
        <div className={styles.filterbtndiv}>
          <Button
            onClick={() => handleFilterChange("0")}
            className={styles.filterbtn}
            variant={selectedFilter === "0" ? "text" : "outlined"}
          >
            Active
          </Button>
          <Button
            onClick={() => handleFilterChange("1")}
            className={styles.filterbtn}
            variant={selectedFilter === "1" ? "text" : "outlined"}
          >
            Completed
          </Button>
          <Button
            onClick={() => handleFilterChange("2")}
            className={styles.filterbtn}
            variant={selectedFilter === "2" ? "text" : "outlined"}
          >
            Missed
          </Button>
        </div>
        <Button
          onClick={handleAddChallenge}
          className={styles.addbtn}
          variant="contained"
        >
          Add Challenge <FaPlus />
        </Button>
      </div>

      {selectedFilter === "0" ? listData.length === 0 ? (
        <div className={styles.imgdiv}>
          <img src={Image} alt="img" className={styles.img}/>
          <p>No challenges to show!</p>
        </div>
      ) : (
        listData?.map((item, index) => (
          <ChallengeCard itemData={item} open={open} />
        ))
      ) : null}

      {selectedFilter === "1" ? listData.length === 0 ? (
        <div className={styles.imgdiv}>
          <img src={Image} alt="img" className={styles.img}/>
          <p>No challenges to show!</p>
        </div>
      ) : (
        listData?.map((item, index) => (
          <ChallengeCard itemData={item} open={open} hidebtn={true} />
        ))
      ) : null}

      {selectedFilter === "2" ? listData.length === 0 ? (
        <div className={styles.imgdiv}>
          <img src={Image} alt="img" className={styles.img}/>
          <p>No challenges to show!</p>
        </div>
      ) : (
        listData?.map((item, index) => (
          <ChallengeCard itemData={item} open={open} hidebtn={true} />
        ))
      ) : null}

      <DialogBox open={openDialog} close={close} status={openDialog} />
    </div>
  );
};

export default HomeScreen;
