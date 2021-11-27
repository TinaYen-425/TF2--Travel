"use strict";

var regionSelect = document.querySelector('.regionSelect');
var actCard = document.querySelector('.activityGroup');
var pageDom = document.querySelector('.pagination-act');
var data = [];

var getData = function getData() {
  axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity?$select=City%2C%20Name%2CActivityName%2CDescription%2CLocation%2CCharge%2CPhone%2CPicture&$filter=contains(City%2C%20'')&$format=JSON", {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    data = response.data;
    data.length = 200;
    allFunction();
  })["catch"](function (error) {
    console.log(error);
  });
};

getData(); //取得API
//TDX Key

function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  var AppID = '3772c88e1a8547a48bdc36dbe1cc0a54';
  var AppKey = 'M0lMXPUTX7HweJe2DvUrWRXUUEg'; //  填入自己 ID、KEY 結束

  var GMTString = new Date().toGMTString();
  var ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  var HMAC = ShaObj.getHMAC('B64');
  var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return {
    'Authorization': Authorization,
    'X-Date': GMTString
  };
} //功能


function allFunction() {
  regionFilter(); //選出縣市

  pageinit(); //分頁
} //篩選城市的活動


regionSelect.addEventListener('change', citySelect); //選出縣市

function regionFilter() {
  var city = data.map(function (item) {
    return item.City;
  });
  var region = {}; // region 有22個縣市

  region = new Set(city);
  var str = "<option value=\"\u4E0D\u5206\u7E23\u5E02\" disabled selected hidden>\u4E0D\u5206\u7E23\u5E02</option>";
  region.forEach(function (item) {
    str += "<option value=\"".concat(item, "\">").concat(item, "</option>");
  });
  regionSelect.innerHTML = str;
} //縣市選擇


var newData = [];

function citySelect(e) {
  var city = e.target.value;
  newData = data.filter(function (item) {
    return item.City == city;
  });
  newData.length = 4;
  render();
} // render 


function render() {
  var unfound = 'https://jubeatt.github.io/The-F2E-3rd-Travel-Guide/img/default.ae8ac2fa.png';
  var str = '';
  newData.forEach(function (item, index) {
    var picUrl = item.Picture.PictureUrl1;

    if (picUrl == undefined) {
      picUrl = unfound;
    }

    str += "<li class=\"act-items p-4 bg-white box-shadow mb-12 mb-md-4\">\n              <a href=\"#\" class=\"d-flex\">\n                  <div class=\"card-pic me-4\"><img class=\"card-height\"\n                          src=\"".concat(picUrl, "\" alt=\"").concat(item.Picture.PictureDescription1, "\">\n                  </div>\n                  <div class=\"card-body\">\n                      <h3 class=\"font-m mb-3 font-md-s mb-md-9\">\n                          ").concat(item.Name, "</h3>\n                      <p class=\"text-grey font-s mb-3 d-md-none \">\n                          ").concat(index === 2 ? item.Description.substring(31, 129) : item.Description.substring(0, 95), "\n                      <span>...</span></p>\n                      <div\n                          class=\"card-bottom d-flex align-center justify-between px-1\">\n                          <div class=\"d-flex align-center\">\n                              <div class=\"me-3 me-md-2\"><img\n                                      src=\"./assets/images/gps_pink.png\"\n                                      alt=\"gps_pink\"></div>\n                              <div class=\"font-s\">").concat(item.Location, "</div>\n                          </div>\n                          <input type=\"submit\"\n                              class=\"act-btn d-md-none text-primary font-s\"\n                              value=\"\u6D3B\u52D5\u8A73\u60C5\">\n                      </div>\n                  </div>\n              </a>\n                     </li>");
  });
  actCard.innerHTML = str;
} //分頁製作//


var pageData = []; //整理分頁data

function dataToPage() {
  var temp = [];
  data.forEach(function (item, index) {
    if ((index + 1) % 4 != 0) {
      temp.push(item);
    } else {
      temp.push(item);
      pageData.push(temp);
      temp = [];
    }
  });
} //整理後的pageData做pageCreate


function pageCreate() {
  var str = '';
  pageData.forEach(function (item, index) {
    str += "<li class=\"pagination-item mb-2\" data-page=\"".concat(index + 1, "\">").concat(index + 1, "</li>");
  });
  pageDom.innerHTML = str;
} //選染到畫面


var unfound = 'https://jubeatt.github.io/The-F2E-3rd-Travel-Guide/img/default.ae8ac2fa.png';

function renderPageData() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var str = '';
  pageData[page - 1].forEach(function (item, index) {
    var picUrl = item.Picture.PictureUrl1;

    if (picUrl == undefined) {
      picUrl = unfound;
    }

    if (item.Description == '無' || '') {
      item.Description = '無相關內容';
    }

    str += " <li class=\"act-items p-4 bg-white box-shadow mb-12 mb-md-4\">\n              <a href=\"#\" class=\"d-flex\">\n                  <div class=\"card-pic me-4\"><img class=\"card-height\"\n                          src=\"".concat(picUrl, "\" alt=\"").concat(item.Picture.PictureDescription1, "\">\n                  </div>\n                  <div class=\"card-body\">\n                      <h3 class=\"font-m mb-3 font-md-s mb-md-9\">\n                          ").concat(item.Name.substring(0, 17), "</h3>\n                      <p class=\"text-grey font-s mb-3 d-md-none \">\n                          ").concat(index === 2 ? item.Description.substring(31, 129) : item.Description.substring(0, 95), "<span>...</span>\n                      </p>\n                      <div\n                          class=\"card-bottom d-flex align-center justify-between px-1\">\n                          <div class=\"d-flex align-center\">\n                              <div class=\"me-3 me-md-2\"><img\n                                      src=\"./assets/images/gps_pink.png\"\n                                      alt=\"gps_pink\"></div>\n                              <div class=\"font-s\">").concat(item.City, "</div>\n                          </div>\n                          <input type=\"submit\"\n                              class=\"act-btn d-md-none text-primary font-s\"\n                              value=\"\u6D3B\u52D5\u8A73\u60C5\">\n                      </div>\n                  </div>\n              </a>\n                     </li>");
  });
  actCard.innerHTML = str;
} //分頁監聽


pageDom.addEventListener('click', function (e) {
  if (e.target.nodeName != 'LI') return;
  var pageNum = e.target.dataset.page;
  renderPageData(pageNum);
  var pageClick = document.querySelectorAll('.pagination-item');
  pageClick.forEach(function (item) {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
});

function pageinit() {
  dataToPage();
  pageCreate();
  renderPageData();
}

var foodPageDom = document.querySelector('.pagination-food');
var foodDom = document.querySelector('.restaruntGroup'); //食物串接

var foodData = [];

var getfoodData = function getfoodData() {
  axios.get("https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$select=Name%2CPicture%2CCity&$format=JSON", {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    foodData = response.data;
    foodData.length = 200;
    foodPageFun();
  })["catch"](function (error) {
    console.log(error);
  });
};

getfoodData();

function foodPageFun() {
  //分頁
  foodDataToPage();
  foodPageCreate();
  foodRender();
} //food分頁


var pageFoodData = []; //food 整理出分頁data

function foodDataToPage() {
  var temp = [];
  foodData.forEach(function (item, index) {
    if ((index + 1) % 10 != 0) {
      temp.push(item);
    } else {
      temp.push(item);
      pageFoodData.push(temp);
      temp = [];
    }
  });
} //分頁串接


function foodPageCreate() {
  var str = '';
  pageFoodData.forEach(function (item, index) {
    str += "<li class=\"pagination-item mb-2\" data-page=\"".concat(index + 1, "\">").concat(index + 1, "</li>");
  });
  foodPageDom.innerHTML = str;
} //分頁渲染


function foodRender() {
  var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var str = '';
  pageFoodData[page - 1].forEach(function (item, index) {
    var picUrl = item.Picture.PictureUrl1;

    if (picUrl == undefined) {
      picUrl = unfound;
    }

    str += "\n      <li class=\"res-item bg-white p-3 box-shadow\">\n      <a class=\"inline-block\" href=\"#\">\n          <div class=\"res-pic mb-2\"><img class=\"res-pic\"\n                  src=\"".concat(picUrl, "\"\n                  alt=\"").concat(item.Picture.PictureDescription1, "\"></div>\n          <h3 class=\"font-s mb-7 mb-md-1 text-height\"><span\n                  class=\"d-md-none\">").concat(item.Name, "</span><span\n                  class=\"d-none d-md-block\">").concat(item.Name.substring(0, 30), "</span></h3>\n          <div class=\"d-flex align-center\">\n              <div class=\"gps-pic me-1\"><img\n                      src=\"./assets/images/gps_pink2.png\" alt=\"gps\">\n              </div>\n              <div class=\"font-xs text-third\">").concat(item.City, "</div>\n          </div>\n      </a>\n  </li>");
  });
  foodDom.innerHTML = str;
} //分頁監聽


foodPageDom.addEventListener('click', function (e) {
  if (e.target.nodeName != 'LI') return;
  var pageNum = e.target.dataset.page;
  foodRender(pageNum);
  var foodPageClick = document.querySelectorAll('.pagination-food li');
  foodPageClick.forEach(function (item) {
    item.classList.remove('active');
  });
  e.target.classList.add('active');
});
//# sourceMappingURL=all.js.map
