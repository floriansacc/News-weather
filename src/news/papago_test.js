const papagoUrl = 'https://openapi.naver.com/v1/papago/n2mt?';
const reqPar = 'source=ko&target=en&text='
const queryToTranslate = '안녕하세요/';


const translateTest = async() => {
    const urlToFetch = papagoUrl + reqPar + queryToTranslate;
    console.log(urlToFetch);
    try {
        const response = await fetch(urlToFetch, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Naver-Client-Id": process.env.REACT_APP_NAVER_ID_CLIENT,
                "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_PASSWORD_CLIENT,
            },
            mode: 'no-cors',
        })
        if (!response.ok) {
            throw new Error('Pas de traduction pour toi BG')
        }
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse
    } catch (error) {
        console.log(error)
    }
}

translateTest();