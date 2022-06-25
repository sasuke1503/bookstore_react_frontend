import { Card, Pagination, Radio, RadioChangeEvent, Rate, Space } from "antd";
import Meta from "antd/lib/card/Meta";
import { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_API } from "../../httpClient/config";
import { httpClient } from "../../httpClient/httpServices";
import { Book } from "../../models/book";
import { Category } from "../../models/categoryBooks";
import { updateKeySearch } from "../../redux/slices/keySearchSlice";
import { appRoutes } from "../../routers/config";
import "./Search.css";

const DEFAULT_PAGE_SIZE = 32;

function SearchPage() {
  const [bookArray, setBookArray] = useState<Book[]>([]);
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [priceValue, setPriceValue] = useState("all");
  const [curPage, setCurPage] = useState(1);
  const [showingBook, setShowingBook] = useState<Book[]>([]);
  const [categoryArray, setCategoryArray] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState(0);
  const [keyWordSearch, setKeyWordSearch] = useState("");
  const [maxPriceSearch, setMaxPriceSearch] = useState(10000000);
  const [minPriceSearch, setMinPriceSearch] = useState(0);

  const booksSearch = useSelector((state: RootStateOrAny) => {
    return state.keySearchSlice.booksSearch;
  });

  const dispatch = useDispatch();

  const stringPrice = (number: number) => {
    const newNumber = number.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });
    return newNumber;
  };

  const onChange = (e: RadioChangeEvent) => {
    console.log(e.target.value);
    if (booksSearch.keyWord != null) {
      dispatch(
        updateKeySearch({
          idCategory: e.target.value,
          keyWord: booksSearch.keyWord,
          minPrice: 0,
          maxPrice: 100000000,
        })
      );
      setValue(booksSearch.idCategory);
      console.log(booksSearch.keyWord);
      let bookSearch = {};
      setCategorySearch(parseInt(e.target.value));
      if (e.target.value === 0) {
        dispatch(
          updateKeySearch({
            idCategory: null,
            keyWord: booksSearch.keyWord,
            minPrice: 0,
            maxPrice: 100000000,
          })
        );
        bookSearch = {
          idCategory: null,
          keyWord: booksSearch.keyWord,
          minPrice: minPriceSearch,
          maxPrice: maxPriceSearch,
        };
      } else {
        bookSearch = {
          idCategory: parseInt(e.target.value),
          keyWord: booksSearch.keyWord,
          minPrice: minPriceSearch,
          maxPrice: maxPriceSearch,
        };
      }
      console.log(bookSearch);
      setValue(e.target.value);
      httpClient()
        .post(APP_API.booksOfCate, bookSearch)
        .then((res) => {
          console.log(res);
          setBookArray([...res.data]);
          console.log(bookArray);
          setShowingBook([...res.data.slice(0, DEFAULT_PAGE_SIZE)]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // if (e.target.value == 0) {
    //   onLoadBook();
    // } else {
  };
  const onPriceChange = (e: RadioChangeEvent) => {
    if (booksSearch.keyWord != null) {
      console.log(e.target.value);
      setPriceValue(e.target.value);
      let bookSearch = {};

      const priceSearch = (
        min: number,
        max: number,
        id: number,
        key: string
      ) => {
        setMinPriceSearch(min);
        setMaxPriceSearch(max);

        if (value === 0) {
          bookSearch = {
            idCategory: null,
            keyWord: booksSearch.keyWord,
            minPrice: min,
            maxPrice: max,
          };
        } else {
          bookSearch = {
            idCategory: id,
            keyWord: booksSearch.keyWord,
            minPrice: min,
            maxPrice: max,
          };
        }
      };

      if (e.target.value === "all") {
        priceSearch(0, 10000000, categorySearch, "");
      } else if (e.target.value === "40") {
        priceSearch(0, 40000, categorySearch, "");
      } else if (e.target.value === "4070") {
        priceSearch(40000, 70000, categorySearch, "");
      } else if (e.target.value === "70100") {
        priceSearch(70000, 100000, categorySearch, "");
      } else if (e.target.value === "100150") {
        priceSearch(100000, 150000, categorySearch, "");
      } else if (e.target.value === "150") {
        priceSearch(150000, 10000000, categorySearch, "");
      }

      console.log(bookSearch);

      httpClient()
        .post(APP_API.booksOfCate, bookSearch)
        .then((res) => {
          console.log(res);
          setBookArray([...res.data]);
          console.log(bookArray);
          setShowingBook([...res.data.slice(0, DEFAULT_PAGE_SIZE)]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onSearch = () => {
    console.log(keyWordSearch);
    if (booksSearch.keyWord != null) {
      console.log(booksSearch);
      if (booksSearch.idCategory == null) setValue(0);
      else {
        setValue(booksSearch.idCategory);
      }
      //setValue(booksSearch.idCategory);
      setCategorySearch(booksSearch.idCategory);
      let bookSearch = {};
      if (value == 0 && booksSearch.idCategory != null) {
        bookSearch = {
          idCategory: booksSearch.idCategory,
          keyWord: booksSearch.keyWord,
          minPrice: minPriceSearch,
          maxPrice: maxPriceSearch,
        };
      } else if (value == 0 && booksSearch.idCategory == null) {
        bookSearch = {
          idCategory: null,
          keyWord: booksSearch.keyWord,
          minPrice: minPriceSearch,
          maxPrice: maxPriceSearch,
        };
      } else {
        bookSearch = {
          idCategory: booksSearch.idCategory,
          keyWord: booksSearch.keyWord,
          minPrice: minPriceSearch,
          maxPrice: maxPriceSearch,
        };
      }
      console.log(bookSearch);
      httpClient()
        .post(APP_API.booksOfCate, bookSearch)
        .then((res) => {
          console.log(res);
          setBookArray([...res.data]);
          console.log(bookArray);
          setShowingBook([...res.data.slice(0, DEFAULT_PAGE_SIZE)]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onCardClick = (id: string) => {
    navigate(appRoutes.bookDetail.replace(":id", id));
    window.scrollTo(0, 0);
  };
  const onPageChange = (page: number, pageSize: number) => {
    console.log(booksSearch);
    setCurPage(page);
    setShowingBook([
      ...bookArray.slice((page - 1) * pageSize, page * pageSize),
    ]);
  };

  // const [_, setSearchParams] = useSearchParams();
  useEffect(() => {
    // const searchParams = new URLSearchParams();
    // searchParams.set("category", "12");
    // setSearchParams(searchParams);
    onSearch();
    //onLoadBook();

    httpClient()
      .get(APP_API.categoryBooks)
      .then((res) => {
        console.log(res);
        setCategoryArray([...res.data]);
        console.log(categoryArray);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [booksSearch]);

  return (
    <>
      <div className="d-flex bg-white pr-3">
        <div>
          {/* <div className="mt-5 mr-2 facet-list ">
            <Search
              placeholder="input search text"
              onChange={(e) => onKeyChange(e)}
              onSearch={() => onSearch()}
              style={{
                width: 230,
                borderBottom: "1px solid #efefef",
                paddingBottom: "20px",
              }}
            />
          </div> */}
          <div className="pt-5 mr-2 facet-list">
            <p className="font-cate-title">Danh mục sách:</p>
            <Radio.Group key="category" onChange={onChange} value={value}>
              <Space
                direction="vertical"
                style={{
                  gap: "0px",
                  borderBottom: "1px solid #efefef",
                  paddingBottom: "20px",
                }}
              >
                <Radio value={0} className="font-cate">
                  Tất cả
                </Radio>
                {categoryArray.length > 0 &&
                  categoryArray.map((category: Category) => (
                    <Radio value={category.id} className="font-cate">
                      {category.nameCategory}
                    </Radio>
                  ))}
              </Space>
            </Radio.Group>
          </div>
          <div className="pt-5 mr-2 facet-list">
            <p className="font-cate-title">Giá:</p>
            <Radio.Group
              key="price"
              onChange={onPriceChange}
              value={priceValue}
            >
              <Space
                direction="vertical"
                style={{
                  gap: "0px",
                  borderBottom: "1px solid #efefef",
                  paddingBottom: "20px",
                }}
              >
                <Radio value="all" className="font-cate">
                  Tất cả
                </Radio>
                <Radio value="40" className="font-cate">
                  Under 40.000đ
                </Radio>
                <Radio value="4070" className="font-cate">
                  40.000đ to 70.000đ
                </Radio>
                <Radio value="70100" className="font-cate">
                  70.000đ to 100.000đ
                </Radio>
                <Radio value="100150" className="font-cate">
                  100.000đ to 150.000đ
                </Radio>
                <Radio value="150" className="font-cate">
                  Above 150.000đ
                </Radio>
              </Space>
            </Radio.Group>
          </div>
        </div>
        <div className="right-content">
          <div className="book-list">
            {showingBook.length > 0 &&
              showingBook.map((book: Book) => (
                <Card
                  key={book.id}
                  hoverable
                  onClick={() => onCardClick(book.id.toString())}
                  cover={
                    <img
                      className="preview-image"
                      alt={book.nameBook}
                      src={book.bookImages[0]?.image}
                    />
                  }
                >
                  <Meta
                    title={book.nameBook}
                    description={
                      <>
                        <div
                          style={{
                            display: "flex",
                            marginBottom: "0px",
                            alignItems: "end",
                          }}
                        >
                          <p
                            style={{
                              color: "rgb(255, 66, 78)",
                              marginBottom: "0",
                            }}
                          >
                            {stringPrice(
                              book.price - (book.price * book.discount) / 100
                            )}{" "}
                            ₫
                          </p>
                          {book.discount > 0 && (
                            <>
                              <p
                                style={{
                                  color: "rgb(128, 128, 137) ",

                                  textDecoration: "line-through",
                                  paddingLeft: "3px",
                                  marginBottom: "0",
                                  fontSize: "12px",
                                }}
                              >
                                {stringPrice(book.price)}₫
                              </p>
                              <p className="discountt">-{book.discount}%</p>
                            </>
                          )}
                        </div>
                        <div>
                          <Rate value={book.rating} disabled></Rate>
                        </div>
                      </>
                    }
                  />
                </Card>
              ))}
          </div>
          <div className="text-center">
            <Pagination
              className="p-3 mb-4"
              total={bookArray.length}
              onChange={onPageChange}
              defaultPageSize={DEFAULT_PAGE_SIZE}
              current={curPage}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchPage;