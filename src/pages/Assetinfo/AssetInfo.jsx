import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./AssetInfo.module.css";
import { Button, Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AssetInfo = () => {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const [imgUrl, setImgUrl] = useState();
  const [assetInfo, setAssetInfo] = useState();

  const getAssetInfo = async () => {
    await axios
      .get(`http://localhost:5000/asset/ids/${assetId}`)
      .then((response) => {
        const assetTemp = response.data.assets[0];
        setAssetInfo(assetTemp);
        getImg(assetTemp);
      });
  };
  const getImg = async (assetInfo) => {
    if (assetInfo) {
      await axios
        .get(`http://localhost:5000/images/${assetInfo.img}`, {
          responseType: "blob",
        })
        .then((response) => {
          setImgUrl(URL.createObjectURL(response.data));
        });
    }
  };
  const goToLocation = () => {
    navigate(`/location/${assetInfo.location}`);
  };

  useEffect(() => {
    getAssetInfo();
  }, []);

  return (
    <div>
      <Header></Header>
      <div className={styles.content}>
        {assetInfo && (
          <div className={styles.content__locationInfo}>
            <div className={styles.content__locationInfo__element}>
              <label>Title</label>
              <p>{assetInfo.title}</p>
              <Divider />
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Description</label>
              <p>{assetInfo.description}</p>
              <Divider />
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Tag</label>
              <p>{assetInfo.tag}</p>
              <Divider />
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Amount</label>
              <p>{assetInfo.value}</p>
              <Divider />
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Price</label>
              <p>{assetInfo.cost}</p>
            </div>
          </div>
        )}
        <div>
          <img className={styles.image} src={imgUrl} alt="some pic" />
        </div>
      </div>
      <div className={styles.btnContainer}>
        <Button className={styles.btn} onClick={goToLocation}>
          <p>Back to location</p>
        </Button>
      </div>
    </div>
  );
};

export default AssetInfo;
