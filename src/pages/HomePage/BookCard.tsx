import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Rate } from "antd";
import Meta from "antd/lib/card/Meta";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_API } from "../../httpClient/config";
import { httpClient } from "../../httpClient/httpServices";
import { Book, Category } from "../../models/book";
import { appRoutes } from "../../routers/config";

interface BookCardProps {
  book: Book;
}

function BookCard({ book }: BookCardProps) {
  const navigate = useNavigate();
  const stringPrice = (number: number) => {
    const newNumber = number.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    });

    return newNumber;
  };
  useEffect(() => {}, [book]);

  return (
    <>
      <Card
        key={book.id}
        hoverable
        bordered
        onClick={() => {
          navigate(appRoutes.bookDetail.replace(":id", book.id.toString()));
          window.scrollTo(0, 0);
        }}
        cover={
          <img
            className="home-preview-image"
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
                {book.bookForEvents.length < 1 && (
                  <>
                    <p
                      style={{
                        color: "rgb(255, 66, 78)",
                        marginBottom: "0",
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                    >
                      {stringPrice(
                        book.price - (book.price * book.discount) / 100
                      )}{" "}
                      ₫
                    </p>
                    {book.discount > 0 && (
                      <>
                        <p className="discountt">-{book.discount}%</p>
                      </>
                    )}
                  </>
                )}
                {book.bookForEvents.length > 0 && (
                  <>
                    {book.bookForEvents[0].discountPercentValue && (
                      <>
                        <p
                          style={{
                            color: "rgb(255, 66, 78)",
                            marginBottom: "0",
                            fontSize: "15px",
                            fontWeight: 500,
                          }}
                        >
                          {stringPrice(
                            book.price -
                              (book.price *
                                book.bookForEvents[0].discountPercentValue) /
                                100
                          )}{" "}
                          ₫
                        </p>
                        <p className="discountt">
                          -{book.bookForEvents[0].discountPercentValue}%
                        </p>
                      </>
                    )}

                    {book.bookForEvents[0].discountValue && (
                      <>
                        <p
                          style={{
                            color: "rgb(255, 66, 78)",
                            marginBottom: "0",
                            fontSize: "15px",
                            fontWeight: 500,
                          }}
                        >
                          {stringPrice(
                            book.price - book.bookForEvents[0].discountValue
                          )}
                          ₫
                        </p>
                        <p className="discountt">
                          -{book.bookForEvents[0].discountValue}đ
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
              <div>
                <Rate
                  value={book.rating}
                  disabled
                  style={{
                    fontSize: "15px",
                  }}
                ></Rate>
              </div>
            </>
          }
        />
      </Card>
    </>
  );
}

export default BookCard;
