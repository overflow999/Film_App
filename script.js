const mainElement=document.querySelector('main');
const navLinks = document.querySelectorAll('#mainnav ul li a')
let filmData;
let dataSet = 'films'
let url = 'https://ghibliapi.vercel.app/films'

async function getData(url){
    const dataPromise= await fetch(url);
    const data = await dataPromise.json();
//  console.log(films)

   if(dataSet === 'films'){
    mainElement.innerHTML='';
    setSort(data);
    addCards(data);
    filmData=data;
    document.querySelector('nav form').style.visibility='visible'
    document.getElementById('sortorder').removeAttribute('disabled')
   }   
   else{
    mainElement.innerHTML='';
    document.querySelector('nav form').style.visibility='hidden'
    addCards(data)
   }
}

getData(url);

document.getElementById('sortorder').addEventListener('change',function(){
    mainElement.innerHTML='';
    setSort(filmData)
    addCards(filmData)
    
})

function setSort(array){
  const sortOrder = document.getElementById('sortorder').value;
  switch(sortOrder){
    case 'title':array.sort((a,b)=>(a.title > b.title) ? 1 : -1);break;
    case 'release_date':array.sort((a,b)=>(a.release_date > b.release_date) ? 1 : -1);break;
    case 'rt_score':array.sort((a,b)=>(parseInt(a.rt_score) > parseInt(b.rt_score)) ? -1 : 1);break;
  }
}

navLinks.forEach(
    function(eachlink){
        eachlink.addEventListener('click',function(e){
            e.preventDefault
           const thislink = e.target.getAttribute('href').substring(1);
           url = 'https://ghibliapi.vercel.app/' + thislink
           dataSet = thislink
         getData(url);
        })
    }
)

function addCards(array){
    array.forEach(eachItem => {
        Createcard(eachItem)
    })
}


async function Createcard(data){
   const card=document.createElement('article');
   switch(dataSet){
   case 'films':card.innerHTML=filmcardContent(data);break;
   case 'people':card.innerHTML= await peopleCardContent(data);break;
   case 'locations':card.innerHTML= await locationCardContent(data);break;
   case 'species':card.innerHTML= await speciesCardContent(data);break;
   case 'vehicles':card.innerHTML= await vehicleCardContent(data);break;
   }
   mainElement.appendChild(card)
}

function filmcardContent(data){
    let html = `<h2>${data.title}</h2>`;
     html += `<p><strong>Director</strong>${data.director}</p>`;
     html += `<p><strong>Released</strong>${data.release_date}</p>`;
     html += `<p> ${data.description}</p>`
     html += `<p><strong>Roten Tomatoes Score</strong>${data.rt_score}</p>`;  
     return html;
}

async function peopleCardContent(data){

    const thefilms = data.films;
    let filmTitles=[];
    for(eachFilm of thefilms){
        const filmTitle= await indivItem(eachFilm,'title');
        filmTitles.push(filmTitle)
    }
  const species=await indivItem(data.species,'name')
  let html = `<h2>${data.name}</h2>`
  html+=`<p> <strong>Details:</strong> gender ${data.gender},age ${data.age},eye color ${data.eye_color},
  hair color ${data.hair_color}</p>`
  html +=` <p> <strong>Species:</strong>${species}</p>`
  html +=` <p> <strong>Films:</strong>${filmTitles.join(', ')}</p>`
//   console.log(data)
  return html
 
}
async function locationCardContent(data){
    const regex = 'https?:\/\/'
    const theResidents = data.residents;
    let residentNames=[];
    for(eachResident of theResidents){
        if(eachResident.match(regex)){
            const resName= await indivItem(eachResident,'name');
            residentNames.push(resName);
        }
        else{
            residentNames[0]='no data available'
        }
        
    }

    const thefilms = data.films;
    let filmTitles=[];
    for(eachFilm of thefilms){
        const filmTitle= await indivItem(eachFilm,'title');
        filmTitles.push(filmTitle)
    }

  let html = `<h2>${data.name}</h2>`
  html+=`<p> <strong>Details:</strong> climate ${data.climate},
  terrain ${data.terrain},surface water ${data.surface_water} %</p>`
  html +=` <p> <strong>Films:</strong>${filmTitles.join(', ')}</p>`
  html +=` <p> <strong>Residents:</strong>${residentNames.join(', ')}</p>`
  return html
 
}

async function speciesCardContent(data){

    
    const people = data.people;
    let peopleNames=[];
    for(eachperson of people){       
            const personName = await indivItem(eachperson,'title');
            peopleNames.push(personName) 
        }
    
    const thefilms = data.films;
    let filmTitles=[];
    for(eachFilm of thefilms){
            const filmTitle= await indivItem(eachFilm,'title');
            filmTitles.push(filmTitle)
        }
    
  let html = `<h2>${data.name}</h2>`
  html +=`<p> <strong>Classification:</strong> ${data.calssification}</p>`
  html +=`<p> <strong>Eye Colors:</strong> ${data.eye_colors}</p>`
  html +=`<p> <strong>Hair Colors:</strong> ${data.hair_colors}</p>`
  html +=` <p> <strong>People:</strong>${peopleNames.join(', ')}</p>`
  html +=` <p> <strong>Films:</strong>${filmTitles.join(', ')}</p>`
//   console.log(data)
  return html
 
}

async function vehicleCardContent(data){    
  let html = `<h2>${data.name}</h2>`
  html +=`<p> <strong>Description:</strong> ${data.description}</p>`
  html +=`<p> <strong>Vehicle Class:</strong> ${data.vehicle_class}</p>`
  html +=`<p> <strong>Length:</strong> ${data.length} feet </p>`
  html +=` <p> <strong>Pilot:</strong>${await indivItem(data.pilot, 'name')}</p>`
  html +=` <p> <strong>Film:</strong>${await indivItem(data.films, 'title')}</p>`
//   console.log(data)
  return html
 
}


async function indivItem(url,item){
    var theItem;
    try {
        const itemPromise = await fetch(url)
        const data = await itemPromise.json()
        theItem=data[item]

    } catch (error) {
        theItem='no data available'

    } finally{
        return theItem;  
    }
    
    
    
}
