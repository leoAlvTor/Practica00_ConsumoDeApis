var search = [];
var searchPagination = [];

function getPeliculasID(id) {
    alert(id);
    let url = 'https://www.omdbapi.com/?apikey=533bb6&i=' + id;
    hacerPeticionAjax(url, getPeliculas, 'NULL');
}

function getPeliculasNombre() {
    let nombre = document.getElementById('txtNombre').value.split(' ').join('+');
    let url = 'https://www.omdbapi.com/?apikey=533bb6&s=' + nombre;
    hacerPeticionAjax(url, getPeliculas, lstXButton);
}

function getPeliculas(data) {
    document.getElementById('footer').innerHTML = "";
    search = [];
    let tmpArray = [];
    searchPagination = [];
    if (data.Title === undefined) {
        if (data.Search.length > 5) {
            for (let i = 0, j = data.Search.length; i < j; i += 5) {
                tmpArray = data.Search.slice(i, i + 5);
                if (tmpArray.length >= 5)
                    searchPagination.push(tmpArray);
                else
                    search.push(tmpArray);
            }
        } else {
            for (let i = 0; i < data.Search.length; i++) {
                search.push(data.Search[i]);
            }
        }
        if (searchPagination.length >= 1 && search.length > 0) {
            createFooter(searchPagination.length + 1);
        } else if (searchPagination.length >= 1 && search.length === 0) {
            createFooter(searchPagination.length)
        }
    } else {
        search.push(data);
        cargarTabla(search);
    }
}

function createFooter(length) {
    let html = "";
    for (let i = 0; i < length; i++) {
        html = html + "<input type='button' onclick='lstXButton(this.id)' id=" + i + " value='Página-" + i + "'>";
    }
    document.getElementById('footer').innerHTML = html;
}

function hacerPeticionAjax(url, callback, callback2) {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url, true);
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            let response = ajax.responseText;
            let responseJSON = JSON.parse(response);
            callback(responseJSON);
            callback2(0);
        }
    };
}


function cargarTabla(datos) {
    let keys = Object.keys(datos[0]);
    if (datos.length > 1) {
        keys.push("Más Detalles");
    } else {
        keys.pop();
    }
    let table = "";
    for (let i = 0; i < keys.length; i++) {
        table += "<th>" + keys[i] + "</th>";
    }
    console.log(table + '<---');
    for (let i = 0; i < datos.length; i++) {
        let dt = datos[i];
        table = table + "<tr>";
        for (let j = 0; j < keys.length; j++) {
            if (keys[j] == "Ratings") {
                let ratings = dt[keys[j]];
                values = [];
                for (let k = 0; k < ratings.length; k++) {
                    values.push("->" + ratings[i].Source + '<->' + ratings[i].Value + "<-");
                }
                table += "<td>" + values.toString() + "</td>";
            } else if (keys[j] == "Poster") {
                if (dt[keys[j]] === "N/A") {
                    table += "<td><img alt='img' class='thumbnail' src=https://www.octoparse.com/images/404_logo.gif style='width:150px;height:250px;'></td>";
                } else
                    table += "<td><img alt='img' class='thumbnail' src=" + dt[keys[j]] + " style='width:150px;height:250px;'></td>";
            } else if (keys[j] == "Más Detalles") {
                table += "<td><input type='button' class='input_button' onclick='getPeliculasID(this.id)' value='Más Detalles' id=" + dt["imdbID"] + "></td>";
            } else {
                table += "<td>" + dt[keys[j]] + "</td>";
            }
        }
        table = table + "</tr>";
    }
    document.getElementById('peliculas').innerHTML = table;
}

function lstXButton(id) {
    document.getElementById('peliculas').innerHTML = "";

    if (id >= searchPagination.length) {
        cargarTabla(search[0]);
    } else if (id < searchPagination.length) {
        cargarTabla(searchPagination[id])
    }
}
