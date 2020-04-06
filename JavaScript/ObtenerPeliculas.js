var search = [];
var searchPagination = [];

async function getPeliculasID(){
    let id = document.getElementById('txtIMBD').value;
    let url = 'https://www.omdbapi.com/?apikey=533bb6&i='+id;
    hacerPeticionAjax(url, getPeliculas, lstXButton);
}

async function getPeliculasNombre(){
    let nombre = document.getElementById('txtNombre').value.split(' ').join('+');
    let url = 'https://www.omdbapi.com/?apikey=533bb6&s='+nombre;
    hacerPeticionAjax(url, getPeliculas, lstXButton);
}

function getPeliculas(data){
    search = [];
    let tmpArray = [];
    searchPagination = [];

    if(data.Title !== null){

    }

    if(data.Search.length > 5){
        for (let i = 0, j=data.Search.length; i < j; i+=5) {
            tmpArray = data.Search.slice(i, i+5);
            if(tmpArray.length >= 5)
                searchPagination.push(tmpArray);
            else
                search.push(tmpArray);
        }
    }else{
        for (let i = 0; i < data.Search.length; i++) {
            search.push(data.Search[i]);
        }
    }

    if(searchPagination.length >= 1 && search.length > 0){
       createFooter(searchPagination.length+1);
    }else if(searchPagination.length >=1 && search.length === 0){
        createFooter(searchPagination.length)
    }
}

function createFooter(length){
    let html = "";
    for (let i = 0; i < length; i++) {
        html =html + "<input type='button' onclick='lstXButton(this.id)' id="+ i +" value="+ i +">";
    }
    document.getElementById('footer').innerHTML = html;
}

function hacerPeticionAjax(url, callback, callback2){
    let ajax = new XMLHttpRequest();
    ajax.open('GET', url, true);
    ajax.send();
    ajax.onreadystatechange = function () {
        if(ajax.readyState === 4 && ajax.status === 200){
            console.log("AJAX DONE Suchesfuly :v ");
            let response = ajax.responseText;
            let responseJSON = JSON.parse(response);
            callback(responseJSON);
            callback2(0);
        }
    };
    console.log("Request sent suchesfulys ajio ajio");
}


function cargarTabla(datos) {
    let table ="<tr>\n" +
        "<th>TITULO</th>\n" +
        "<th>AÑO</th>\n" +
        "<th>imbdID</th>\n" +
        "<th>TIPO</th>\n" +
        "<th>POSTER</th>\n" +
        "</tr>";

    for (let i = 0; i < datos.length; i++) {
        console.log(datos[i].Poster);
        if(datos[i].Poster == "N/A"){
            datos[i].Poster = 'https://www.zhibit.org/image/463008a3-03bc8586ca-42f0c202-s-9/Reflections-1.jpg';
        }
        table =table+ "<tr>" +
            "<td>"+ datos[i].Title +"</td>" +
            "<td>"+ datos[i].Year +"</td>" +
            "<td>"+ datos[i].imdbID +"</td>" +
            "<td>"+ datos[i].Type +"</td>" +
            "<td><img alt='img' src="+ datos[i].Poster +"></td>" +
            "</tr>";
    }

    document.getElementById('peliculas').innerHTML = table;
}

function lstXButton(id){
    document.getElementById('peliculas').innerHTML = "";
    if(id >= searchPagination.length){
        cargarTabla(search[0]);
    }else if(id < searchPagination.length){
        cargarTabla(searchPagination[id])
    }
}