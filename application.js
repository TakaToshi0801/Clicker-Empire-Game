// 名前空間
const config = {
    initialPage: document.getElementById("initialPage"),
    mainPage: document.getElementById("mainPage"),
}

// 要素を消す
function displayNone(ele){
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
}

// 要素を表示
function displayBlock(ele){
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
}

class UserAccount {
    constructor(name, age, days, money, items){
        this.name = name;
        this.age = age;
        this.days = days;
        this.money = money;
        this.items = items;
        this.clickCount = 0;
        this.clickPerMoney = 25;
        this.incomePerSec = 0;
        this.stock = 0;
    }
}

class Items {
    constructor(name, type, maxAmount, price, currentAmount, incomeRate, url){
        this.name = name;
        this.type = type;
        this.maxAmount = maxAmount;
        this.price = price;
        this.currentAmount = currentAmount;
        this.incomeRate = incomeRate;
        this.url = url;
    }
    
}

// 商品情報
const items = [
    new Items("Flip machine", "ability", 500, 15000, 0, 25, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png"),
    new Items("ETF Stock", "investment", Infinity, 300000, 0, 0.1, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
    new Items("ETF Bonds", "investment", Infinity, 300000, 0, 0.07, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
    new Items("Lemonade Stand", "realState", 1000, 30000, 0, 30, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png"),
    new Items("Ice Cream Truck", "realState", 500, 100000, 0, 120, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png"),
    new Items("House", "realState", 100, 20000000, 0, 3200, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png"),
    new Items("TownHouse", "realState", 100, 40000000, 0, 64000, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png"),
    new Items("Mansion", "realState", 20, 250000000, 0, 500000, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png"),
    new Items("Industrial Space", "realState", 10, 1000000000, 0, 2200000, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png"),
    new Items("Hotel Skyscraper", "realState", 5, 10000000000, 0, 25000000, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png"),
    new Items("Bulet-Speed Sky Railway", "realState", 1, 10000000000000, 0, 30000000000, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png")
]

// 最初に実行される関数
function initializeUserAccount(userName){
    if(userName == "toshiki"){
        return new UserAccount(userName, 20, 0, 500000, items);
    } else {
        return new UserAccount(userName, 20, 0, 50000, items);
    }
}

// 新規登録ボタンの挙動
let registrationBtn = document.getElementById("registration");
registrationBtn.addEventListener("click", function() {
    let userName = document.querySelectorAll("input").item(0).value;
    if(userName == ""){
        alert("Please put your name.");
    } else {
        config.initialPage.classList.add("d-none");
        let newUserAccount = initializeUserAccount(userName);
        config.mainPage.append(createMainPage(newUserAccount));
        startTime(newUserAccount);
    }
})
 
// ログインボタンの挙動
let loginBtn = document.getElementById("login");
loginBtn.addEventListener("click", function() {
    let userName = document.querySelectorAll("input").item(0).value;
    if(userName == ""){
        alert("Please put your name.");
    } else {
        let userData = JSON.parse(localStorage.getItem(userName));
        if(userData === null){
            alert("There is no data.")
        } else {
            config.initialPage.classList.add("d-none");
            config.mainPage.append(createMainPage(userData));
            startTime(userData);
        }
    }
})

// メインページの大枠
function createMainPage(userAccount){
    displayNone(config.initialPage);
    displayBlock(config.mainPage);
    config.mainPage.innerHTML = "";
    let container = document.createElement("div");
    container.innerHTML = 
    `
    <div class="vh-100 d-flex justify-content-center p-md-5 pb-5">
        <div class="p-2 d-flex col-md-11 col-lg-10">
            <!-- 左のハンバーガー -->
            <div class="bg-dark p-2 col-4" id="burgerStatus">
            </div>
            <div class= "col-8">
                <!-- 右上のユーザー情報 -->
                <div class= "p-1" id="userInfo">  
                </div>
                <!-- Item一覧表示 -->
                <div class="bg-dark mt-2 p-1 scroll-wrap" id="displayItems">
                </div>
                <!-- 右下ボタン各種 -->
                <div class="mt-2" id="saveResetBtn">
                </div>    
            </div>
        </div>
    </div>
    `;
    container.querySelectorAll("#burgerStatus").item(0).append(burgerStatus(userAccount));
    container.querySelectorAll("#userInfo").item(0).append(displayUserInfo(userAccount));
    container.querySelectorAll("#displayItems").item(0).append(itemInfo(userAccount));
    container.querySelectorAll("#saveResetBtn").item(0).append(saveAndResetData(userAccount));
    return container;
}

// 左のハンバーガーの情報
function burgerStatus(userAccount){
    let burgerContainer = document.createElement("div");
    burgerContainer.innerHTML = 
    `
    <div class="bg-dark text-white text-center border-wrap">
        <h3>${userAccount.clickCount} Burgers</h3>
        <h5>One Click ￥${userAccount.clickPerMoney}</h5>
    </div>
    <div id="burgerBtn" class="d-flex justify-content-center select-animation">
        <img src="https://cdn.pixabay.com/photo/2014/04/02/17/00/burger-307648_960_720.png" class="py-2 hover img-fuid" id="burger">
    </div>
    `;
    let burgerClick = burgerContainer.querySelectorAll("#burgerBtn").item(0);
    burgerClick.addEventListener("click", function(){
        updateInfoWhenClick(userAccount);
    });
    return burgerContainer;
}

// 右上のuser情報
function displayUserInfo(userAccount){
    let userConteiner = document.createElement("div");
    userConteiner.classList.add("d-flex", "flex-wrap", "p-1", "bg-dark");
    userConteiner.innerHTML = 
    `
    <div class="text-white text-center col-12 col-sm-6 border-wrap">
        <h5>Name : ${userAccount.name}</h5>
    </div>
    <div class="text-white text-center col-12 col-sm-6 border-wrap">
        <h5>${userAccount.age} years old</h5>
    </div>
    <div class="text-white text-center col-12 col-sm-6 border-wrap">
        <h5>${userAccount.days} days</h5>
    </div>
    <div class="text-white text-center col-12 col-sm-6 border-wrap">
        <h5>¥${Math.floor(userAccount.money)}</h5>
    </div>
    `;
    return userConteiner;
}

//右のitem情報
function itemInfo(userAccount){
    let itemConteiner = document.createElement("div");
    itemConteiner.classList.add("d-flex", "flex-wrap", "p-1");
    for(let i = 0; i < userAccount.items.length; i++){
        itemConteiner.innerHTML += 
        `
        <div id="item-detail" class="d-flex justify-content-between border-wrap select-animation">
            <img src=${userAccount.items[i].url} class="img-fluid col-4">
            <div class="d-flex flex-column col-8 text-white">
                <h3>${userAccount.items[i].name}</h3>
                <h5>￥${userAccount.items[i].price}</h5>
                <h5>${userAccount.items[i].currentAmount} / ${userAccount.items[i].maxAmount}</h5>
                <h5 class="text-success">¥ ${eachItemIncome(userAccount.items[i].type, userAccount.items[i].incomeRate)}</h5><br>
                <h3>${userAccount.items[i].currentAmount}</h3>
            </div>
        </div>
        `;
    }
    // クリックした時現在のページを消し、詳細ページの関数を呼び出す
    let select = itemConteiner.querySelectorAll("#item-detail");
    for(let i = 0; i < select.length; i++){
        select[i].addEventListener("click", function() {
            config.mainPage.querySelectorAll("#displayItems").item(0).innerHTML = "";
            config.mainPage.querySelectorAll("#displayItems").item(0).append(itemDetailPage(userAccount, i));
        });
    }
    return itemConteiner;
}

// ハンバーガーをクリックした時に情報を更新
function updateInfoWhenClick(userAccount){
    userAccount.money += userAccount.clickPerMoney;
    userAccount.clickCount++;
    updateUserInfo(userAccount);
    updateBurgerInfo(userAccount);
}

// 左のburgerページを更新
function updateBurgerInfo(userAccount){
    let burgerInfo = config.mainPage.querySelectorAll("#burgerStatus").item(0);
    burgerInfo.innerHTML = "";
    burgerInfo.append(burgerStatus(userAccount));
}

// 右上のuser情報ページを更新
function updateUserInfo(userAccount){
    let userInfo = config.mainPage.querySelectorAll("#userInfo").item(0);
    userInfo.innerHTML = "";
    userInfo.append(displayUserInfo(userAccount));
}

// typeによって収入の表示を変える
function eachItemIncome(type, rate){
    if(type == "ability") return rate + " / click";
    else if(type == "investment") return rate + "% / sec";
    else return rate + " / sec";
}

// itemをクリックした時に詳細ページを表示
function itemDetailPage(userAccount, index){
    let container = document.createElement("div");
    container.innerHTML = 
    `
    <div class="d-flex justify-content-between align-items-center text-white">
        <div class="d-flex flex-column col-6">
            <h2>${userAccount.items[index].name}</h2>
            <h3>Price: ￥${userAccount.items[index].price}</h3>
            <h3>Max Purchase: ${userAccount.items[index].maxAmount}</h3>
            <h3>¥ ${eachItemIncome(userAccount.items[index].type, userAccount.items[index].incomeRate)}</h3>
        </div>
        <img src=${userAccount.items[index].url} class="img-fluid col-6">
    </div>
    <div class="col-12 text-white">
        <h5>How many would you like to buy?</h5>
        <div class="form-group row coul-12">
            <input type="number" class="form-control form-control-sm text-left" placeholder="0">
        </div>
        <h5 id="totalPrice" class="text-right">total ¥ 0</h5>
    </div>
    `;

    // item詳細ページのtotalを更新
    let currentCount = container.querySelectorAll("input").item(0);
    currentCount.addEventListener("input", function() {
        container.querySelectorAll("#totalPrice").item(0).innerHTML = 
        `
        total ¥ ${calcTotalPrice(userAccount.items[index], currentCount.value)}
        `;
    })

    container.append(backPurchaseBtn());
    
    //  「Go Back」ボタンの挙動
    let backBtn = container.querySelectorAll(".back-btn").item(0);
    backBtn.addEventListener("click", function() {
        config.mainPage.querySelectorAll("#displayItems").item(0).innerHTML = "";
        config.mainPage.querySelectorAll("#displayItems").item(0).append(itemInfo(userAccount));
    })

    // 「Purchase」ボタンの挙動
    let purchaseBtn = container.querySelectorAll(".purchase-btn").item(0);
    purchaseBtn.addEventListener("click", function() {
        let countItem = container.querySelectorAll("input").item(0).value;
        checkPurchaseItem(userAccount, countItem, index);
        config.mainPage.innerHTML = "";
        config.mainPage.append(createMainPage(userAccount));
    })
    return container;
}

// moneyを更新
// moneyや最大購入可能数と比較して購入可能かどうかの判断
function checkPurchaseItem(userAccount, countItem, index){
    if(countItem <= 0){
        alert("Invalid Number");
    } else if(userAccount.items[index].cuurentAmount + countItem > userAccount.items[index].maxAmount && userAccount.items[index].type != "investment"){
        alert("You cannot buy anymore.");
    } else if(calcTotalPrice(userAccount.items[index], countItem) > userAccount.money){
        alert("You don't have enough money.");
    } else {
        // moneyとcurrentAmountを更新
        userAccount.money -= calcTotalPrice(userAccount.items[index], countItem);
        userAccount.items[index].currentAmount += Number(countItem);
        // ETF Stockは毎購入ごとに10%購入額が増加
        if(userAccount.items[index].name == "ETF Stock"){
            userAccount.stock += calcTotalPrice(userAccount.items[index], countItem);
            userAccount.items[index].price = calcEtfStockPrice(userAccount.items[index], countItem);
            updateUserIncome(userAccount, userAccount.items[index], countItem);
        } else if(userAccount.items[index].name == "ETF Bonds"){
            userAccount.stock += calcTotalPrice(userAccount.items[index], countItem);
            updateUserIncome(userAccount, userAccount.items[index], countItem);
        } else {
            updateUserIncome(userAccount, userAccount.items[index], countItem);
        }
    }
}

//　ユーザーの収入を更新
function updateUserIncome(userAccount, item, countItem){
    count = Number(countItem)
    if(item.type == "ability"){
        userAccount.clickPerMoney += count * item.incomeRate;
    } else if(item.type == "investment") {
        userAccount.incomePerSec += userAccount.stock * item.incomeRate;
    } else {
        userAccount.incomePerSec += count * item.incomeRate;
    }
}

// 合計金額を計算
function calcTotalPrice(item, countItem){
    let total = 0;
    count = Number(countItem);
    // ETF Stockは毎購入ごとに10%購入額が増加
    if(item.name == "ETF Stock"){
        for(let i = 0; i < countItem; i++){
            total += parseInt(item.price * Math.pow(1 + item.incomeRate, i))
        }
        return total;
    } else if(countItem > 0 && countItem % 1 == 0) return total += item.price * countItem;
    else return total;
}

// ETF Stockの価格を計算し更新
function calcEtfStockPrice(item, countItem){
    return parseInt(item.price * Math.pow(1 + item.incomeRate, countItem));
}

// 「go back」ボタンと「purchase」ボタン
function backPurchaseBtn(){
    let container = document.createElement("div");
    container.innerHTML = 
    `
    <div class="d-flex justify-content-between">
        <div class="col-6 pl-0">
            <button class="btn btn-outline-primary col-12 back-btn">Go Back</button>
        </div>
        <div class="col-6 pr-0">
            <button class="btn btn-primary col-12 purchase-btn">Purchase</button>
        </div>
    </div>
    `;
    return container;
}

// タイマー関係の識別子
let intervalId;
//　1秒経つごとにdaysを更新とincomePerSecをmoneyにプラス
function startTime(userAccount){
    intervalId = setInterval(function(){
        userAccount.days++;
        userAccount.money += userAccount.incomePerSec;
        calcYears(userAccount);
    },1000);
}

// タイマーを止める
function stopTime(){
    clearInterval(intervalId);
}

// 365日経ったらage++
function calcYears(userAccount){
    if(userAccount.days % 365 == 0){
        userAccount.age++;
        updateUserInfo(userAccount);
    } else {
        updateUserInfo(userAccount);
    }
}

// 右下のボタン各種
function saveAndResetData(userAccount){
    let container = document.createElement("div");
    container.classList.add("d-flex", "justify-content-end");
    container.innerHTML = 
    `
    <div class="border p-2 mr-2 hover" id="reset">
        <i class="fas fa-undo fa-2x text-white"></i>
    </div>
    <div class="border p-2 hover" id="save">
        <i class="fas fa-save fa-2x text-white"></i>
    </div>
    `;

    // resetボタンの挙動
    let resetBtn = container.querySelectorAll("#reset").item(0);
    resetBtn.addEventListener("click", function() {
        let resetConfirm = window.confirm("Reset all data?");
        if(resetConfirm){    
            stopTime();
            let userName = userAccount.name;
            if(localStorage.getItem(userName) != null){
                localStorage.removeItem(userName);
            }
            let newUserAccount = initializeUserAccount(userName);
            config.mainPage.innerHTML = "";
            config.mainPage.append(createMainPage(newUserAccount));
            startTime(newUserAccount);
        }
    })
    // 保存ボタンの挙動
    let saveBtn = container.querySelectorAll("#save").item(0);
    saveBtn.addEventListener("click", function() {
        stopTime();
        localStorage.setItem(userAccount.name, JSON.stringify(userAccount));
        alert("Saved your data. Please put the same name when you login.");
        displayNone(config.mainPage);
        let inputForm = document.querySelectorAll("#nameInput").item(0);
        inputForm.value = "";
        displayBlock(config.initialPage);
    })
    return container;
}