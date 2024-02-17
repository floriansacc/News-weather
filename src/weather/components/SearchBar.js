import { useState, useContext, useEffect } from "react";
import { QueryContext } from "../../layout/RootLayout";
import { IoSearchCircleSharp } from "react-icons/io5";

export default function SearchBar(props) {
  const { issearching, setissearching, searchedcity, setsearchedcity } = props;
  const { dataimport, isDarkTheme } = useContext(QueryContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCitySelection = (e) => {
    const temp = e.target.innerHTML.split(", ");
    setsearchedcity({ no1: temp[0], no2: temp[1], no3: temp[2] });
    setissearching(!issearching);
    setSearchValue("");
    setSearchResult(null);
  };

  const handleSubmitSearch = (e) => {
    if ((e.code === "Enter" || e === "pass") && searchValue) {
      setSearchResult(
        Array.from(
          new Set(
            dataimport.map((obj) => `${obj.Part1}, ${obj.Part2}, ${obj.Part3}`),
          ),
        )
          .filter((text) => text.includes(searchValue))
          .map((x, i) => (
            <p
              className={`${
                isDarkTheme ? "bg-[#202639]" : "bg-white/75"
              } mx-2 my-1 cursor-pointer rounded-md border border-solid border-transparent px-1`}
              onClick={handleCitySelection}
            >
              {x}
            </p>
          )),
      );
    }
  };

  useEffect(() => {
    const escPress = (e) => {
      if (e.code === "Escape" || e.keyCode === 27) {
        setSearchResult("");
      }
    };
    document.getElementById("search-div").addEventListener("keydown", escPress);
    return () =>
      document.getElementById("search-div")
        ? document
            .getElementById("search-div")
            .removeEventListener("keydown", escPress)
        : null;
  }, []);

  // <p> {Object.keys(searchedcity).map((x, i) => `${searchedcity[x]}, `)}</p>

  return (
    <div
      className={`${
        issearching ? "flex" : "hidden "
      } absolute top-0 z-50 flex h-fit w-[80%] flex-1 flex-row flex-nowrap items-end justify-end p-2 transition-all scrollbar-default`}
      id="search-div"
    >
      <input
        placeholder="검색"
        className="flex w-full flex-1 rounded-lg bg-white bg-opacity-75 p-1"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyDown={handleSubmitSearch}
      />
      <IoSearchCircleSharp
        className="absolute right-2 h-8 w-8 cursor-pointer"
        onClick={() => handleSubmitSearch("pass")}
      />
      <div className="absolute top-12 flex max-h-[300px] w-fit flex-col overflow-y-auto whitespace-nowrap rounded-xl bg-gray-200 bg-opacity-100">
        {searchResult}
      </div>
    </div>
  );
}
