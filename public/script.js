const maindiv = document.querySelector("#main-wrapper");

class weatherView {
    constructor() {
        //create input
        this.input = document.createElement("input");
        this.input.placeholder = "Enter City";
        //create show button
        this.addButton = document.createElement("button");
        this.addButton.innerHTML = "Show";
        //add big show block
        this.showInfo = document.createElement("div");
        this.showInfo.id = "howInfo";
        //add text area in big show block
        this.textHolder = document.createElement("div");
        //add save button
        this.saveButton = document.createElement("button");
        this.saveButton.innerHTML = "SAVE";
        //add text area and save button to big show block
        this.showInfo.append(this.textHolder, this.saveButton);
    }

    // start rendering main view
    initView() {
        maindiv.append(this.input, this.addButton, this.showInfo);
    }

    // show city weather which choose user on big block
    ShowCurrentWeather(text) {
        // var dataFromInput=this.
        this.textHolder.innerHTML = `Город: ${text[0]}, температура: ${text[1]}, погодные условия: ${text[2]};`;
    }

    // showAllCity(bigArr) {
    //     this.Mini_showInfo.innerHTML = " ";
    //     for (let i = 0; i < bigArr.length; i++) {
    //         this.ShowSavedWeather(bigArr[i]);
    //     }
    // }
    // //show small blocks with saved city
    // ShowSavedWeather(dateFromServer) {
    //     this.Mini_showInfo = document.createElement("div");
    //     this.Mini_showInfo.className = "Mini_showInfo";
    //     this.removeButton = document.createElement("button");
    //     this.removeButton.id = dateFromServer._id;
    //     this.removeButton.innerHTML = "&#10006";
    //     //add data from server
    //     this.textWrapper = document.createElement("div");
    //     this.Mini_showInfo.append(this.textWrapper, this.removeButton);
    //     this.textWrapper.innerHTML = dateFromServer.text;
    //     document.getElementsByTagName("body")[0].appendChild(this.Mini_showInfo);
    // }
}

class weatherModel {
    constructor() {
        //my server adress
        this.url = "http://localhost:3000/City";
    }

    //download weather data from API and add it to arr
    async downloadWeather(URL) {
        try {
            let response = await fetch(URL);
            let data = await response.json();
            this.arr = [];
            this.arr.push(data["name"], data["main"]["temp"], data["weather"][0]["description"]);
            console.log(this.arr);
        } catch (err) {
            return err;
        }
    }
    //download saved on server city
    async getCityFromMyServer() {
        try {
            let result = await fetch(this.url);
            let json = await result.json();
            return json;
        } catch (err) {
            return err;
        }
    }

    // add weather data from API to my server
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
        // this.saveNewCity = this.saveNewCity.bind(this);
        // this.removeSavedCity = this.removeSavedCity.bind(this);
        // this.refreshPage = this.refreshPage.bind(this);
    }

    //work with botton
    hendle() {
        this.view.addButton.addEventListener("click", this.getAPIinfo);
        this.view.saveButton.addEventListener("click", this.saveNewCity);
        // this.view.removeButton.addEventListener("click", this.removeSavedCity);
        // this.refreshPage();
    }

    // get text from input, add this text in API adress, start download weather data from API and add to big block needed data
    async getAPIinfo() {
        this.Cityname = this.view.input.value;
        this.jokeUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.Cityname}&lang=ru&appid=5ac5782cf77907b89d71c99feb3ba0ef`;
        await this.model.downloadWeather(this.jokeUrl);
        this.view.ShowCurrentWeather(this.model.arr);

        // .then((result) => result instanceof Error)
        //     ? console.log(result)
        //     : this.view.ShowCurrentWeather(this.model.arr);
        // this.view.ShowCurrentWeather.innerHTML = `Город: ${this.model.arr[0]}, температура: ${this.model.arr[1]}, погодные условия: ${this.model.arr[2]};`;
    }

    // get arr with needed data, post it to my server and start render mini block with this data
    saveNewCity() {
        let text = this.model.arr;
        if (text.length > 0) {
            this.model.addWeatherToServer(text).then((result) => {
                if (result instanceof Error) return console.log(result);

                this.view.ShowSavedWeather(result);
                this.view.removeButton.addEventListener("click", this.removeSavedCity);
                console.log(result);
            });
        }
    }

    // removeSavedCity(e) {
    //     let id = e.target.id;
    //     this.model
    //         .removeCity(id)
    //         .then((result) => (result instanceof Error ? console.log(result) : this.refreshPage()));
    // }

    // refreshPage() {
    //     this.model
    //         .getCityFromMyServer()
    //         .then((result) => (result instanceof Error ? console.log(result) : this.view.showAllCity(result)));
    //     this.view.removeButton.addEventListener("click", this.removeSavedCity);
    // }
}

(function init() {
    const view = new weatherView();
    const model = new weatherModel(view);
    const controller = new weatherController(view, model);
    view.initView();
    controller.hendle();
})();
