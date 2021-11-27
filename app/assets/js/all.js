const regionSelect = document.querySelector('.regionSelect');
const actCard = document.querySelector('.activityGroup');
const pageDom = document.querySelector('.pagination-act');

let data = [];
const getData = () => {
    axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$select=City%2C%20Name%2CActivityName%2CDescription%2CLocation%2CCharge%2CPhone%2CPicture&$filter=contains(City%2C%20'')&$format=JSON`,
        {
            headers: getAuthorizationHeader()
        }
    )
        .then(response => {
            data = response.data;
            data.length = 200;
            allFunction();
        })
        .catch(error => {
            console.log(error);
        });
}
getData();//取得API
//TDX Key
function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = '3772c88e1a8547a48bdc36dbe1cc0a54';
    let AppKey = 'M0lMXPUTX7HweJe2DvUrWRXUUEg';
    //  填入自己 ID、KEY 結束
    let GMTString = new Date().toGMTString();
    let ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    let HMAC = ShaObj.getHMAC('B64');
    let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
    return { 'Authorization': Authorization, 'X-Date': GMTString };
}
//功能
function allFunction() {
    regionFilter();//選出縣市
    pageinit();//分頁
}
//篩選城市的活動
regionSelect.addEventListener('change', citySelect);

//選出縣市
function regionFilter() {
    let city = data.map(item => {
        return item.City
    })
    let region = {}; // region 有22個縣市
    region = new Set(city);
    let str = `<option value="不分縣市" disabled selected hidden>不分縣市</option>`
    region.forEach(item => {
        str += `<option value="${item}">${item}</option>`
    })
    regionSelect.innerHTML = str;
}
//縣市選擇
let newData = [];
function citySelect(e) {
    const city = e.target.value;
    newData = data.filter(item => {
        return item.City == city;
    })
    newData.length = 4;
    render()
}
// render 
function render() {
    let unfound = 'https://jubeatt.github.io/The-F2E-3rd-Travel-Guide/img/default.ae8ac2fa.png';
    let str = '';
    newData.forEach((item, index) => {
        let picUrl = item.Picture.PictureUrl1;
        if (picUrl == undefined) {
            picUrl = unfound;
        }
        str += `<li class="act-items p-4 bg-white box-shadow mb-12 mb-md-4">
              <a href="#" class="d-flex">
                  <div class="card-pic me-4"><img class="card-height"
                          src="${picUrl}" alt="${item.Picture.PictureDescription1}">
                  </div>
                  <div class="card-body">
                      <h3 class="font-m mb-3 font-md-s mb-md-9">
                          ${item.Name}</h3>
                      <p class="text-grey font-s mb-3 d-md-none ">
                          ${index === 2 ? item.Description.substring(31, 129) : item.Description.substring(0, 95)}
                      <span>...</span></p>
                      <div
                          class="card-bottom d-flex align-center justify-between px-1">
                          <div class="d-flex align-center">
                              <div class="me-3 me-md-2"><img
                                      src="./assets/images/gps_pink.png"
                                      alt="gps_pink"></div>
                              <div class="font-s">${item.Location}</div>
                          </div>
                          <input type="submit"
                              class="act-btn d-md-none text-primary font-s"
                              value="活動詳情">
                      </div>
                  </div>
              </a>
                     </li>`
    })
    actCard.innerHTML = str;
}
//分頁製作//
let pageData = [];
//整理分頁data
function dataToPage() {
    let temp = [];
    data.forEach((item, index) => {
        if ((index + 1) % 4 != 0) {
            temp.push(item);
        } else {
            temp.push(item);
            pageData.push(temp);
            temp = [];
        }
    })
}
//整理後的pageData做pageCreate
function pageCreate() {
    let str = ''
    pageData.forEach((item, index) => {
        str += `<li class="pagination-item mb-2" data-page="${index + 1}">${index + 1}</li>`
    })
    pageDom.innerHTML = str;
}
//選染到畫面
let unfound = 'https://jubeatt.github.io/The-F2E-3rd-Travel-Guide/img/default.ae8ac2fa.png';
function renderPageData(page = 1) {
    let str = ''
    pageData[page - 1].forEach((item, index) => {
        let picUrl = item.Picture.PictureUrl1;
        if (picUrl == undefined) {
            picUrl = unfound;
        }
        if (item.Description == '無'|| ''){
            item.Description = '無相關內容'
        }
        str += ` <li class="act-items p-4 bg-white box-shadow mb-12 mb-md-4">
              <a href="#" class="d-flex">
                  <div class="card-pic me-4"><img class="card-height"
                          src="${picUrl}" alt="${item.Picture.PictureDescription1}">
                  </div>
                  <div class="card-body">
                      <h3 class="font-m mb-3 font-md-s mb-md-9">
                          ${item.Name.substring(0,17)}</h3>
                      <p class="text-grey font-s mb-3 d-md-none ">
                          ${index === 2 ? item.Description.substring(31, 129) : item.Description.substring(0, 95)}<span>...</span>
                      </p>
                      <div
                          class="card-bottom d-flex align-center justify-between px-1">
                          <div class="d-flex align-center">
                              <div class="me-3 me-md-2"><img
                                      src="./assets/images/gps_pink.png"
                                      alt="gps_pink"></div>
                              <div class="font-s">${item.City}</div>
                          </div>
                          <input type="submit"
                              class="act-btn d-md-none text-primary font-s"
                              value="活動詳情">
                      </div>
                  </div>
              </a>
                     </li>`
    })
    actCard.innerHTML = str;
}
//分頁監聽
pageDom.addEventListener('click', e => {
    if (e.target.nodeName != 'LI') return;
    let pageNum = e.target.dataset.page;
    renderPageData(pageNum);
    let pageClick = document.querySelectorAll('.pagination-item');
    pageClick.forEach(item => {
        item.classList.remove('active');
    })
    e.target.classList.add('active');

})
function pageinit() {
    dataToPage();
    pageCreate();
    renderPageData();
}

const foodPageDom = document.querySelector('.pagination-food');
const foodDom = document.querySelector('.restaruntGroup')

//食物串接
let foodData = [];
const getfoodData = () => {
    axios.get(
        `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$select=Name%2CPicture%2CCity&$format=JSON`,
        {
        headers: getAuthorizationHeader()
        }
    )
    .then(response => {
        foodData = response.data;
        foodData.length = 200;
        foodPageFun()
    })
    .catch(error => {
        console.log(error);
    })
}
getfoodData();
function foodPageFun(){
    //分頁
    foodDataToPage();
    foodPageCreate();
    foodRender();
}
//food分頁
let pageFoodData = [];
//food 整理出分頁data
function foodDataToPage(){
    let temp = [];
  foodData.forEach((item,index)=> {
      if ((index + 1) % 10 != 0){
         temp.push(item);
      }else{
        temp.push(item)
        pageFoodData.push(temp);
        temp = []
      }
  })
}

//分頁串接
function foodPageCreate(){
  let str = '';
  pageFoodData.forEach((item,index)=> {
      str += `<li class="pagination-item mb-2" data-page="${index+1}">${index + 1}</li>`
  })
  foodPageDom.innerHTML = str;
}
//分頁渲染
function foodRender(page = 1){
    let str = '';
    pageFoodData[page - 1].forEach((item,index) => {
        let picUrl = item.Picture.PictureUrl1;
        if (picUrl == undefined) {
            picUrl = unfound;
        }
      str += `
      <li class="res-item bg-white p-3 box-shadow">
      <a class="inline-block" href="#">
          <div class="res-pic mb-2"><img class="res-pic"
                  src="${picUrl}"
                  alt="${item.Picture.PictureDescription1}"></div>
          <h3 class="font-s mb-7 mb-md-1 text-height"><span
                  class="d-md-none">${item.Name}</span><span
                  class="d-none d-md-block">${item.Name.substring(0, 30)}</span></h3>
          <div class="d-flex align-center">
              <div class="gps-pic me-1"><img
                      src="./assets/images/gps_pink2.png" alt="gps">
              </div>
              <div class="font-xs text-third">${item.City}</div>
          </div>
      </a>
  </li>`
    })
    foodDom.innerHTML = str;
}
//分頁監聽
foodPageDom.addEventListener('click', e => {
    if(e.target.nodeName != 'LI') return;
    let pageNum = e.target.dataset.page;
    foodRender(pageNum);
    const foodPageClick = document.querySelectorAll('.pagination-food li')
    foodPageClick.forEach(item => {
        item.classList.remove('active')
    })
    e.target.classList.add('active');
})