//All the fuction that I made but don't use in case I have to see how it looks like

const Trashbin = () => {
  useEffect(() => {
    if (isReady !== null && !customFunctionRunRef.current) {
      customFunctionRunRef.current = true;
      liste.forEach((e, i) => {
        setWeatherInfoNow((prev) => ({
          ...prev,
          [e.Phase3]: temporary.slice(i * 8, i * 8 + 8),
        }));
      });
    }
  }, [isReady]);

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async (name, nx, ny) => {
        const urlWeatherList = `${weatherUrlNow}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetimeforecast}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherList, {});
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            "LIST",
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          jsonResponse.response.body.items.item.forEach((x) => {
            setTemporary((prev) => [
              ...prev,
              {
                name: name,
                category: x.category,
                value: x.obsrValue,
                time: x.baseTime,
                nx: x.nx,
                ny: x.ny,
              },
            ]);
          });
          //return setIsReady(true);
        } catch (error) {
          console.log(error);
          setIsLoaded(false);
        }
      };
      liste.map(async (e, i) => {
        setWeatherInfoNow((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        await getWeatherList(e.Phase3, e.nx, e.ny);
      });
      setIsLoaded(true);
    }
    return () => {
      //setIsReady(null);
      //customFunctionRunRef.current = false;
      setTemporary([]);
      setIsLoaded(false);
    };
  }, [refreshData]);

  useEffect(() => {
    if (!liste[0]) {
      return;
    } else {
      const getWeatherList = async (name, nx, ny) => {
        const urlWeatherForecast = `${weatherUrlForecast}?serviceKey=${servicekey}&numOfRows=60&dataType=JSON&pageNo=1&base_date=${basedate}&base_time=${basetime}&nx=${nx}&ny=${ny}`;
        try {
          const response = await fetch(urlWeatherForecast, {});
          if (!response.ok) {
            throw new Error("Pas de météo pour toi");
          }
          const jsonResponse = await response.json();
          window.console.log([
            `List Predi ${name}`,
            jsonResponse.response.header["resultMsg"],
            jsonResponse.response.body.items.item,
          ]);
          jsonResponse.response.body.items.item.forEach((x) => {
            let newData = {
              name: name,
              category: x.category,
              time: x.fcstTime,
              value: x.fcstValue,
              basetime: x.baseTime,
              nx: x.nx,
              ny: x.ny,
            };
            if (x.category === "PTY") {
              setTemporary2((prev) => [...prev, newData]);
            } else if (x.category === "T1H") {
              setTemporary2((prev) => [...prev, newData]);
            } else if (x.category === "SKY") {
              setTemporary2((prev) => [...prev, newData]);
            }
          });
        } catch (error) {
          console.log(error);
          setIsLoadedForecast(false);
        }
      };
      liste.map(async (e, i) => {
        setWeatherForecast((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        setTempForecast((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        setSkyForecast((prev) => ({
          ...prev,
          [e.Phase3]: [],
        }));
        await getWeatherList(e.Phase3, e.nx, e.ny);
      });
      setIsLoadedForecast(true);
    }
    return () => {
      setTemporary2([]);
      setIsLoadedForecast(false);
    };
  }, [refreshData]);
};
