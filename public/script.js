const maindiv = document.querySelector("#main-wrapper");
const textHolder = document.createElement("div");
var arr1 = [];

setTimeout(
    window.addEventListener("load", () => {
        let long;
        let lat;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                long = position.coords.longitude;
                lat = position.coords.latitude;
                const locationURL = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=imperial&lang=ru&appid=5ac5782cf77907b89d71c99feb3ba0ef`;
                fetch(locationURL)
                    .then((response) => {
                        return response.json();
                    })
                    .then(async (data) => {
                        arr1.push(data["name"], data["main"]["temp"], data["weather"][0]["description"]);

                        let c = Math.round(((Number(arr1[1]) - 32) * 5) / 9);
                        console.log(c);
                        textHolder.innerHTML = `Локация: ${arr1[0]}. Tемпература: ${c} °C.  Погодные условия: ${arr1[2]}.`;

                        return arr1;
                    });
            });
        }
    }),
    5000
);

class weatherView {
    constructor(controller) {
        this.controller = controller;

        this.input = document.createElement("input");
        this.input.placeholder = "Enter City";

        this.addButton = document.createElement("button");
        this.addButton.innerHTML = "Show";

        this.showInfo = document.createElement("div");
        this.showInfo.id = "howInfo";

        this.saveButton = document.createElement("button");
        this.saveButton.innerHTML = "SAVE";

        this.showInfo.append(textHolder, this.saveButton);
        this.Mini_showInfoWRAPPER = document.createElement("div");
        this.Mini_showInfoWRAPPER.id = "Mini_showInfoWRAPPER";
    }

    initView() {
        maindiv.append(this.input, this.addButton, this.showInfo, this.Mini_showInfoWRAPPER);
    }

    ShowCurrentWeather(text) {
        let t = Math.round(((Number(text[1]) - 32) * 5) / 9);
        textHolder.innerHTML = `Локация: ${text[0]}.  Tемпература: ${t}°C.  Погодные условия: ${text[2]}.`;
    }

    ShowSavedWeather(dateFromServer) {
        this.Mini_showInfo = document.createElement("div");
        this.Mini_showInfo.className = "Mini_showInfo";
        this.removeButton = document.createElement("button");
        this.removeButton.id = dateFromServer._id;
        this.removeButton.innerHTML = "&#10006";
        this.textWrapper = document.createElement("div");
        this.textWrapper.id = this.textWrapper;

        this.Mini_showInfoWRAPPER.append(this.Mini_showInfo);
        this.Mini_showInfo.append(this.textWrapper, this.removeButton);

        console.log(dateFromServer.text);

        let y = Math.round(((Number(dateFromServer.text[1]) - 32) * 5) / 9);
        this.textWrapper.innerHTML = `Локация: ${dateFromServer.text[0]}.  Tемпература: ${y}°C.  Погодные условия: ${dateFromServer.text[2]}.`;
    }
}

class weatherModel {
    constructor() {
        this.url = "http://localhost:3000/Weather";
    }

    async downloadWeather(URL) {
        try {
            let response = await fetch(URL);
            let data = await response.json();
            console.log(data);
            this.arr = [];

            this.arr.push(data["name"], data["main"]["temp"], data["weather"][0]["description"]);

            return this.arr;
        } catch (err) {
            return err;
        }
    }

    async getCityFromMyServer() {
        try {
            let result = await fetch(this.url);
            let json = await result.json();
            return json;
        } catch (err) {
            return err;
        }
    }

    async addWeatherToServer(text) {
        try {
            let result = await fetch(this.url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text }),
            });
            let json = await result.json();
            return json;
        } catch (err) {
            return err;
        }
    }

    async removeCity(id) {
        try {
            let result = await fetch(this.url + "/" + id, {
                method: "DELETE",
            });
            let json = await result.json();
            console.log(json);
            return json;
        } catch (err) {
            return err;
        }
    }
}

class weatherController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.getAPIinfo = this.getAPIinfo.bind(this);
        this.saveNewCity = this.saveNewCity.bind(this);
        this.removeSavedCity = this.removeSavedCity.bind(this);
        this.refreshPage = this.refreshPage.bind(this);
    }

    hendle() {
        this.view.addButton.addEventListener("click", this.getAPIinfo);
        this.view.saveButton.addEventListener("click", this.saveNewCity);

        this.refreshPage();
    }

    async getAPIinfo() {
        this.Cityname = this.view.input.value;
        console.log(this.Cityname.length);
        if (this.Cityname.length > 0) {
            this.jokeUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.Cityname}&units=imperial&lang=ru&appid=5ac5782cf77907b89d71c99feb3ba0ef`;
            await this.model.downloadWeather(this.jokeUrl);
            this.view.ShowCurrentWeather(this.model.arr);
            this.view.input.value = " ";
            this.view.input.placeholder = "Enter next City";
        } else {
            console.log("Enter Your City");
        }
    }

    saveNewCity() {
        let text = this.model.arr;
        let text1 = globalThis.arr1;
        if (typeof text !== "undefined") {
            this.model.addWeatherToServer(text).then((result) => {
                if (result instanceof Error) return console.log(result);

                this.view.ShowSavedWeather(result);
                this.view.removeButton.addEventListener("click", this.removeSavedCity);
                console.log(result);
            });
        } else {
            this.model.addWeatherToServer(text1).then((result) => {
                if (result instanceof Error) return console.log(result);

                this.view.ShowSavedWeather(result);
                this.view.removeButton.addEventListener("click", this.removeSavedCity);
                console.log(result);
            });
        }
    }

    async removeSavedCity(e) {
        let id = e.target.id;
        this.model
            .removeCity(id)
            .then((result) => (result instanceof Error ? console.log(result) : this.refreshPage()));
    }

    showAllCity(bigArr) {
        for (let i = 0; i < bigArr.length; i++) {
            this.view.ShowSavedWeather(bigArr[i]);
            this.view.removeButton.addEventListener("click", this.removeSavedCity);
        }
    }

    async refreshPage() {
        this.view.Mini_showInfoWRAPPER.innerHTML = "";
        this.model
            .getCityFromMyServer()
            .then((result) => (result instanceof Error ? console.log(result) : this.showAllCity(result)));
        setTimeout(() => {}, 300);
    }
}

(function init() {
    const view = new weatherView();
    const model = new weatherModel();
    const controller = new weatherController(view, model);
    view.initView();
    controller.hendle();
})();
