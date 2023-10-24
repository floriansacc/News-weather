import { useState, useEffect } from "react";
import NewsUnit from "./NewsUnit";
import styles from "../css/news.module.css";

const idClient = process.env.REACT_APP_NAVER_ID_CLIENT;
const pwdClient = process.env.REACT_APP_NAVER_PASSWORD_CLIENT;

export default function NaverNews(props) {
  const [newsInfo, setNewsInfo] = useState([]);
  const [search, setSearch] = useState("");

  const getNews = async (word) => {
    try {
      const displaySearch = 5;
      const sortSearch = "sim";
      const urlNaverNews = `/v1/search/news.json?query=${word}&display=${displaySearch}&sort=${sortSearch}`;
      const response = await fetch(urlNaverNews, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=utf-8",
          "X-Naver-Client-Id": idClient,
          "X-Naver-Client-Secret": pwdClient,
        },
      });
      if (!response.ok) {
        throw new Error("Response failed!");
      }
      const jsonResponse = await response.json();
      jsonResponse.items.forEach((x) => {
        setNewsInfo((prev) => [
          ...prev,
          {
            description: x.description,
            link: x.link,
            pubDate: x.pubDate,
            title: x.title,
          },
        ]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = (e) => {
    getNews(search);
    setNewsInfo([]);
  };

  return (
    <div className={styles.newsBox}>
      <input type="text" onChange={handleSearch} value={search} />
      <button onClick={handleSubmit}>Submit</button>
      <ul>
        {newsInfo.map((x) => (
          <NewsUnit
            description={x.description}
            link={x.link}
            date={x.pubDate}
            title={x.title}
          />
        ))}
      </ul>
    </div>
  );
}

/*      <ul>{newsInfo.map((x, i) => {
        <li>{x.title}</li>
      })}</ul> */
