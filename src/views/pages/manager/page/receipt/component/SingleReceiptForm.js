import React, { useState } from "react";
import DataTableComponent from "../../../component/DataTableComponent";
import SelectReceiptProduct from "./SelectReceiptProduct";
import SingleReceiverForm from "./SingleReceiverForm";
import { AiOutlineDelete } from "react-icons/ai";
import { numberUtils } from "../../../../../../utilities";
import "./index.scss";
import { useDispatch } from "react-redux";
import { receiptActions } from "../../../../../../actions/receipt.actions";
import { useNavigate } from "react-router-dom";
function SingleReceiptForm() {
  const [payMethod, setPayMethod] = useState(1);
  console.log({ payMethod });
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [receiverInfo, setReceiverInfo] = useState({ name: undefined });
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const cartItems = cart.map((item, index) => {
    const temp = {};
    temp.id = item.product._id;
    temp.stt = index + 1;
    temp.name = item.product.name;
    temp.sku = item.product.sku;
    temp.quantity = item.quantity;
    temp.price = item.product.price;
    temp.total = item.product.price * item.quantity;
    temp.avtURL = item.product.avtURL;
    return temp;
  });

  const handleChangeQuantity = (productID, quantity) => {
    if (quantity < 1) return;
    const idx = cart.findIndex((item) => item.product._id == productID);
    if (idx < 0) return;
    const temp = [...cart];
    temp[idx].quantity = quantity;
    setCart(temp);
  };
  const handleDeleteItem = (id) => {
    console.log("delete imte click");

    setCart(cart.filter((item) => item.product._id != id));
    console.log(cart.filter((item) => item.product._id != id));
  };

  const onSubmit = () => {
    const totalPrice = cart.reduce((accumulate, crr) => {
      return accumulate + crr.product.price * crr.quantity;
    }, 0);
    const importPrice = cart.reduce((accumulate, crr) => {
      return accumulate + crr.product.importPrice * crr.quantity;
    }, 0);
    const profit = totalPrice - importPrice;
    console.log({ receiverInfo, cart, totalPrice, profit });
    dispatch(
      receiptActions.create(
        {
          receiver: receiverInfo,
          cart,
          totalPrice,
          profit,
          status: 1,
          payMethod: payMethod,
        },
        () => {
          navigate("/quan-ly/hoa-don");
        }
      )
    );
  };
  const columnDocs = [
    // {field: , headerName: , width: }
    { field: "stt", headerName: "STT", width: 50 },
    {
      field: "name",
      headerName: "T??n s???n ph???m",
      width: 300,
      flex: 1,
      renderCell: (params) => {
        const { avtURL, name, price } = params.row;
        return (
          <div className="product-info-cell display-flex">
            <img src={avtURL} height="50px" alt="" />
            <div
              style={{ marginLeft: "12px", textAlign: "left" }}
              className="price-wrapper"
            >
              <p
                style={{
                  fontFamily: "Montserrat",
                  whiteSpace: "break-spaces",
                  maxWidth: "350px",
                  fontSize: "1.4rem",
                }}
              >
                {name}
              </p>
            </div>
          </div>
        );
      },
    },
    { field: "sku", headerName: "M?? SKU", width: 150 },
    {
      field: "quantity",
      headerName: "S??? l?????ng",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="product-count">
            <div className="display-flex">
              {/* <button
                onClick={() =>
                  handleChangeQuantity(params.row.id, params.row.quantity - 1)
                }
              >
                -
              </button> */}
              <input
                type={"number"}
                value={params.row.quantity}
                onChange={(e) =>
                  handleChangeQuantity(params.row.id, e.target.value)
                }
              />
              {/* <button
                onClick={() =>
                  handleChangeQuantity(params.row.id, params.row.quantity + 1)
                }
              >
                +
              </button> */}
            </div>
          </div>
        );
      },
    },
    {
      field: "price",
      headerName: "????n gi??",
      width: 150,
      valueFormatter: (params) => params.value.toLocaleString() + " VN??",
    },
    {
      field: "total",
      headerName: "Th??nh ti???n",
      minWidth: 150,
      renderCell: (params) => {
        const { price, quantity } = params.row;
        return (
          <div className=" display-flex">
            <p
              style={{
                fontFamily: "Montserrat",
                color: "red",
                fontWeight: "600",
                fontSize: "1.3rem",
              }}
            >
              {numberUtils.numberWithThousandSeperator(price * quantity || 0) +
                " VN??"}
            </p>
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "T??y ch???n",
      minWidth: 50,
      renderCell: (params) => {
        const { price, quantity } = params.row;
        return (
          <div className=" display-flex">
            <span
              onClick={() => handleDeleteItem(params.row.id)}
              className="icon-button"
            >
              <AiOutlineDelete size={18} />
            </span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      {step === 1 && (
        <>
          <h2 style={{ fontSize: "1.6rem", margin: "12px 0" }}>
            B?????c 1: ??i???n th??ng tin kh??ch h??ng
          </h2>
          <SingleReceiverForm
            onSubmit={(e) => {
              setReceiverInfo(e);
              setStep(2);
            }}
            receiverInfo={receiverInfo}
          />
        </>
      )}

      {step === 2 && (
        <>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 12 }}>
            B?????c 2: Ch???n s???n ph???m
          </h2>
          <div className="display-flex justify-content-between">
            <span onClick={() => setStep(1)} className="lw-btn">
              Tr??? l???i
            </span>
            <span
              onClick={() => setStep(3)}
              style={{ backgroundColor: "rgb(143, 0, 0)" }}
              className="lw-btn"
            >
              {`Xem gi??? h??ng (${cart.length})`}
            </span>
          </div>
          <SelectReceiptProduct setCart={setCart} cart={cart} />
        </>
      )}

      {step === 3 && (
        <>
          <h2 style={{ fontSize: "1.8rem", marginBottom: 12 }}>
            B?????c 3: X??c nh???n ????n h??ng
          </h2>
          <div className="receiver-info-wrapper">
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                margin: "12px 0",
                color: "rgb(120,0,0)",
              }}
            >
              Th??ng tin ng?????i nh???n
            </h1>
            <p>
              <strong> H??? v?? t??n:</strong> {receiverInfo.name}
            </p>
            <p>
              <strong> S??? ??i???n tho???i:</strong> {receiverInfo.phone}
            </p>
            <p>
              <strong>?????a ch???:</strong> {receiverInfo.description},{" "}
              {receiverInfo.ward?.name}, {receiverInfo.district?.name},{" "}
              {receiverInfo.province?.name}
            </p>
            <p>
              <strong>Ghi ch??: </strong>
              {receiverInfo.note}
            </p>
          </div>

          <div className="step-1-modal">
            <div className="display-flex justify-content-between">
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "600",
                  margin: "12px 0",
                  color: "rgb(120,0,0)",
                }}
              >
                Chi ti???t ????n h??ng
              </h1>
            </div>
            <DataTableComponent
              rowHeight={100}
              columnDocs={columnDocs}
              rowDocs={cartItems || []}
              autoHeight={true}
              // filter={filter}
            />
            <div className="input-field">
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginRight: "12px",
                  fontWeight: "400",
                }}
              >
                <input
                  onChange={() => setPayMethod(1)}
                  value={payMethod === 2}
                  type="radio"
                  name="payMethod"
                />
                Thanh to??n khi nh???n h??ng
              </label>
              <div className="mystery-box"></div>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginRight: "12px",
                  fontWeight: "400",
                }}
              >
                <input
                  onChange={() => setPayMethod(2)}
                  value={payMethod === 2}
                  type="radio"
                  name="payMethod"
                />
                Momo
              </label>

              <div className="mystery-box"></div>
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginRight: "12px",
                  fontWeight: "400",
                }}
              >
                <input
                  value={payMethod === 2}
                  onChange={() => setPayMethod(3)}
                  type="radio"
                  name="payMethod"
                />
                Thanh to??n qua ng??n h??ng
              </label>
            </div>

            <div style={{ float: "right" }} className="">
              <button
                className="lw-btn"
                onClick={() => {
                  setStep(2);
                }}
                style={{
                  display: "inline-block",
                  marginRight: "12px",
                  backgroundColor: "#a00",
                }}
                type="button"
              >
                Tr??? l???i
              </button>

              <button
                onClick={onSubmit}
                className="lw-btn"
                style={{ marginTop: 18, display: "inline-block" }}
              >
                T???o ????n h??ng
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleReceiptForm;
