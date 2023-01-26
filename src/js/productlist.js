const { createApp } = Vue;

createApp({
  data() {
    return {
      currpage: 1,
      cardlist: [],
      checked: {
        select_secondType: [],
        select_city: [],
        select_price: [],
      },

      prices: [
        "TWD 499 以下",
        "TWD 500~999",
        "TWD 1000~1499",
        "TWD 1500~1999",
        "TWD 2000以上",
      ],
      categorys: ["主題樂園", "水族館", "博物館", "美術館"],
      AllCitys: [
        "基隆",
        "台北",
        "新北",
        "桃園",
        "新竹",
        "苗栗",
        "台中",
        "彰化",
        "南投",
        "雲林",
        "嘉義",
        "台南",
        "高雄",
        "屏東",
        "台東",
        "花蓮",
        "宜蘭",
        "澎湖",
      ],
      citylistnew: [],
      cityshow: false,
      dataget: true,
    };
  },
  created() {
    window.addEventListener("resize", this.resize_adjust, true);
    this.getdata();
    console.log("aaa");
  },
  computed: {
    computedList() {
      let newcardlist1 = [];
      let newcardlist2 = [];
      let newcardlist3 = [];
      if (this.checked.select_secondType.length == 0) {
        newcardlist1 = this.cardlist;
      } else {
        newcardlist1 = this.filters(
          this.cardlist,
          this.checked.select_secondType
        );
      }
      if (this.checked.select_city.length == 0) {
        newcardlist2 = newcardlist1;
      } else {
        newcardlist2 = this.filters(newcardlist1, this.checked.select_city);
      }
      if (this.checked.select_price.length == 0) {
        newcardlist3 = newcardlist2;
      } else {
        newcardlist3 = this.filters(newcardlist2, this.checked.select_price);
      }
      console.log(newcardlist3);
      let citys = new Set();
      let pricestag = new Set();
      let type = new Set();
      newcardlist3.forEach((element) => {
        citys.add(element.Location);
        pricestag.add(element.priceTag);
        type.add(element.ProductSecondType);
      });
      //   this.AllCitys = citys;
      //   this.prices = pricestag;
      //   this.categorys = type;
      return newcardlist3;
    },
    totalpage() {
      return Math.ceil(this.computedList.length / 5);
    },
  },

  methods: {
    ChangeCurrpage(e) {},
    filters(list, select) {
      const result = new Set();
      const set = new Set(select);
      if (select == this.checked.select_city) {
        for (card of list) {
          if (set.has(card.Location)) {
            result.add(card);
          }
        }
      } else if (select == this.checked.select_secondType) {
        for (card of list) {
          if (set.has(card.ProductSecondType)) {
            result.add(card);
          }
        }
      } else if (select == this.checked.select_price) {
        for (card of list) {
          if (set.has(card.priceTag)) {
            result.add(card);
          }
        }
      }
      return Array.from(result);
    },
    getdata() {
      var CID = new URL(location.href);
      // console.log(CID.pathname);
      const city = new Set();
      const catagory = new Set();
      let _this = this;
      this.AllCitys = [];
      this.categorys = [];

      $.ajax({
        method: "POST",
        url: "./php/Product_jerry.php",
        data: {
          path: CID.pathname,
        },
        dataType: "json",
        success: function (response) {
          response.forEach((element) => {
            if (element.ProductText.length >= 80) {
              element.ProductText = element.ProductText.substr(0, 80) + "……";
            }
            switch (true) {
              case element.ProductPrice > 1999:
                element.priceTag = "TWD 2000以上";
                break;
              case element.ProductPrice > 1499:
                element.priceTag = "TWD 1500~1999";
                break;
              case element.ProductPrice > 999:
                element.priceTag = "TWD 1000~1499";
                break;
              case element.ProductPrice > 499:
                element.priceTag = "TWD 500~999";
                break;
              case element.ProductPrice <= 499:
                element.priceTag = "TWD 499 以下";
                break;
            }
            element.score = element.score.substr(0, 3);
            catagory.add(element.ProductSecondType);
            city.add(element.Location);
            _this.cardlist.push(element);
          });
        },
        error: function (exception) {
          alert("數據載入失敗: " + exception.status);
        },
      });
      // console.log(city);
      // console.log(Array.from(city));
      // city.forEach(element => {
      //   console.log(element)
      // });
      this.AllCitys = city;
      this.categorys = catagory;
    },
    selectfunction() {
      this.cardlist;
    },
    showproduct() {},
    changeHeart(e) {
      e.stopPropagation();
      console.log(e.target);
      // let a = e.target;
      // let b = e.target.nextElementSibling
      //   ? e.target.nextElementSibling
      //   : e.target.previousElementSibling;
      // a.classList.add("hidden");
      // b.classList.remove("hidden");
    },
    open_city(e) {
      this.cityshow = !this.cityshow;

      let path = e.path[0].childNodes[1].classList;
      if (path.contains("fa-circle-chevron-down")) {
        path.remove("fa-circle-chevron-down");
        path.add("fa-circle-chevron-up");
      } else {
        path.remove("fa-circle-chevron-up");
        path.add("fa-circle-chevron-down");
      }
    },
    filterCity(e) {
      e.target.querySelector("input").click();
      let city = e.path[0].childNodes[0];
      let text = e.path[0].textContent;
      if (city.checked == false) {
        city.checked = true;
        this.citylist.push(e.path[0].textContent);
      } else if (city.checked == true) {
        city.checked = false;
        this.citylist.forEach((e, index) => {
          if (e == text) {
            this.citylist.splice(index, 1);
          }
        });
      }
    },
    filterSort_bottom_to_top(e) {
      let arr = this.cardlist;
      const eitherSort = (arr = []) => {
        const sorter = (a, b) => {
          return +a.ProductPrice - +b.ProductPrice;
        };
        arr.sort(sorter);
      };
      eitherSort(arr);
      this.classList = arr;
      let epath = e.path[0].style;
      e.path[1].childNodes[1].style.backgroundColor = "#fff";
      e.path[1].childNodes[3].style.backgroundColor = "#fff";
      e.path[1].childNodes[4].style.backgroundColor = "#fff";
      e.path[1].childNodes[1].style.color = "#747774";
      e.path[1].childNodes[3].style.color = "#747774";
      e.path[1].childNodes[4].style.color = "#747774";
      epath.backgroundColor = "#4484ce";
      epath.color = "#fff";
    },
    filterSort_top_to_bottom(e) {
      let arr = this.cardlist;
      const eitherSort = (arr = []) => {
        const sorter = (a, b) => {
          return +b.ProductPrice - +a.ProductPrice;
        };
        arr.sort(sorter);
      };
      eitherSort(arr);
      this.classList = arr;
      let epath = e.path[0].style;
      e.path[1].childNodes[1].style.backgroundColor = "#fff";
      e.path[1].childNodes[2].style.backgroundColor = "#fff";
      e.path[1].childNodes[4].style.backgroundColor = "#fff";
      e.path[1].childNodes[1].style.color = "#747774";
      e.path[1].childNodes[2].style.color = "#747774";
      e.path[1].childNodes[4].style.color = "#747774";
      epath.backgroundColor = "#4484ce";
      epath.color = "#fff";
    },
    filterOrder(e) {
      let arr = this.cardlist;
      const eitherSort = (arr = []) => {
        const sorter = (a, b) => {
          return +b.ProductPurchased - +a.ProductPurchased;
        };
        arr.sort(sorter);
      };
      eitherSort(arr);
      this.classList = arr;
      let epath = e.path[0].style;
      e.path[1].childNodes[2].style.backgroundColor = "#fff";
      e.path[1].childNodes[3].style.backgroundColor = "#fff";
      e.path[1].childNodes[4].style.backgroundColor = "#fff";
      e.path[1].childNodes[2].style.color = "#747774";
      e.path[1].childNodes[3].style.color = "#747774";
      e.path[1].childNodes[4].style.color = "#747774";
      epath.backgroundColor = "#4484ce";
      epath.color = "#fff";
    },
    filterScore(e) {
      let arr = this.cardlist;
      const eitherSort = (arr = []) => {
        const sorter = (a, b) => {
          return +b.score - +a.score;
        };
        arr.sort(sorter);
      };
      eitherSort(arr);
      this.classList = arr;
      let epath = e.path[0].style;
      e.path[1].childNodes[1].style.backgroundColor = "#fff";
      e.path[1].childNodes[2].style.backgroundColor = "#fff";
      e.path[1].childNodes[3].style.backgroundColor = "#fff";
      e.path[1].childNodes[1].style.color = "#747774";
      e.path[1].childNodes[2].style.color = "#747774";
      e.path[1].childNodes[3].style.color = "#747774";
      epath.backgroundColor = "#4484ce";
      epath.color = "#fff";
    },
    filterPrice(e) {
      e.target.querySelector("input").click();
      let price = e.path[0].childNodes[0];
      let text = e.path[0].textContent;
      // if (price.checked == false) {
      //   price.checked = true;
      //   this.pricelist.push(e.path[0].textContent);
      // } else if (price.checked == true) {
      //   price.checked = false;
      //   this.pricelist.forEach((e, index) => {
      //     if (e == text) {
      //       this.pricelist.splice(index, 1);
      //     }
      //   });
      // }
    },
    filterCategory(e) {
      e.target.querySelector("input").click();

      // for (let i = 0; i < this.cardlist.length; i++){
      //   this.cardlist[i].vif=false;
      // }
      // let category = e.composedPath()[0].childNodes[0];
      // let text = e.composedPath()[0].textContent;
      // if (category.checked == false) {
      //   category.checked = true;
      //   this.categorylist.push(e.path[0].textContent);
      // } else if (category.checked == true) {
      //   category.checked = false;
      //   this.categorylist.forEach((e, index) => {
      //     if (e == text) {
      //       this.categorylist.splice(index, 1);
      //     }
      //   });
      // }
      // for (let i = 0; i < this.cardlist.length; i++) {
      //   let label = this.cardlist[i].label;
      //   for (let j = 0; j < this.categorylist.length; j++) {
      //     let list = this.categorylist[j];
      //     if (label.trim() == list.trim()) {
      //       let temp = this.cardlist[i];
      //       temp.vif=true;
      //     }
      //   }
      // }
    },
    openSelectbar(e) {
      let category_btn = document.querySelector(
        ".productlist_new__category_btn"
      );
      target_class = e.target.classList;
      let cate_bar = document.querySelector(".productlist_new__category");
      let dest_bar = document.querySelector(".productlist_new__destination");
      let price_bar = document.querySelector(".productlist_new__price");
      let sort_bar = document.querySelector(".productlist_new__sort");
      let black_bg = document.querySelector(".black_bg");
      let bar_arr = [cate_bar, dest_bar, price_bar, sort_bar];
      let body = document.querySelector("body");
      if (target_class.contains("productlist_new__category_btn")) {
        if (cate_bar.classList.contains("open")) {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          black_bg.classList.remove("on_watch");
          body.classList.remove("stop_scroll");
        } else {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          cate_bar.classList.add("open");
          black_bg.classList.add("on_watch");
          body.classList.add("stop_scroll");
        }
      }
      if (target_class.contains("productlist_new__destination_btn")) {
        console.log("aaa");
        if (dest_bar.classList.contains("open")) {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          black_bg.classList.remove("on_watch");
          body.classList.remove("stop_scroll");
        } else {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          dest_bar.classList.add("open");
          black_bg.classList.add("on_watch");
          body.classList.add("stop_scroll");
        }
      }
      if (target_class.contains("productlist_new__price_btn")) {
        console.log("aaa");
        if (price_bar.classList.contains("open")) {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          black_bg.classList.remove("on_watch");
          body.classList.remove("stop_scroll");
        } else {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          price_bar.classList.add("open");
          black_bg.classList.add("on_watch");
          body.classList.add("stop_scroll");
        }
      }
      if (target_class.contains("productlist_new__sort_btn")) {
        console.log("aaa");
        if (sort_bar.classList.contains("open")) {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          black_bg.classList.remove("on_watch");
          body.classList.remove("stop_scroll");
        } else {
          bar_arr.forEach((element) => {
            element.classList.remove("open");
          });
          sort_bar.classList.add("open");
          black_bg.classList.add("on_watch");
          body.classList.add("stop_scroll");
        }
      }
      if (target_class.contains("black_bg")) {
        bar_arr.forEach((element) => {
          element.classList.remove("open");
        });
        black_bg.classList.remove("on_watch");
        body.classList.remove("stop_scroll");
      }
    },
    resize_adjust() {
      if (screen.width <= 768) {
      }
      if (screen.width > 768) {
        document.querySelector("body").classList.remove("stop_scroll");
        let cate_bar = document.querySelector(".productlist_new__category");
        let dest_bar = document.querySelector(".productlist_new__destination");
        let price_bar = document.querySelector(".productlist_new__price");
        let sort_bar = document.querySelector(".productlist_new__sort");
        let black_bg = document.querySelector(".black_bg");
        let bar_arr = [cate_bar, dest_bar, price_bar, sort_bar];
        bar_arr.forEach((element) => {
          element.classList.remove("open");
        });
        black_bg.classList.remove("on_watch");
      }
    },
    jump_page() {
      window.location.assign("productdetail.html");
    },
  },

  mounted() {},
}).mount("#app");