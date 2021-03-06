import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { appActions, userActions } from "../../../../actions";
import { voucherServices } from "../../../../services";
import { CartItem } from "../../cart/component/CartItem";
import "./ReceiptBrefing.scss";
function ReceiptBrefing({ setTotalPrice, setVoucher, productCount }) {
  const dispatch = useDispatch();
  const products =
    useSelector((state) => state.userReducer.productsInCart) || [];

  var formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const handleDeleteCart = (id) => {
    dispatch(userActions.editCart({ product: id, quantity: 0 }));
  };
  const getTotalPrice = (products) => {
    var price = 0;
    if (products.length > 0) {
      products.forEach((element) => {
        price += element.product.price * element.quantity;
      });
    }
    return price;
  };

  const transportFee = 50000;
  const [promotionalPrice, setPromotionPrice] = useState(0);
  const [code, setCode] = useState("");
  const totalPrice = getTotalPrice(products);
  const finalPrice = totalPrice + transportFee - promotionalPrice;

  useEffect(() => {
    dispatch(userActions.getProductsInCart());
  }, []);

  const handleCheckPromotion = () => {
    console.log(code);
    voucherServices.check(code, { totalPrice, productCount }).then((data) => {
      if (data.success) {
        dispatch(appActions.showSuccessToast(data.message));
        setVoucher(data.voucher);
        console.log(data.voucher);
        setPromotionPrice(data.voucher?.amount);
      } else {
        dispatch(appActions.showFailToast(data.message));
      }
    });
  };

  return (
    <Container className="receipt-brefing">
      <div className="list-product">
        {products.length > 0 &&
          products.map((val, idx) => (
            <div key={idx}>
              <CartItem
                product={val.product}
                quantity={val.quantity}
                handleDeleteCart={handleDeleteCart}
              />
            </div>
          ))}
      </div>
      <div className="receipt-description-wrapper">
        <div className="receipt-description">
          <h1 className="receipt-title">T??M T???T ????N H??NG</h1>
          <div className="price-item">
            <h5>T???ng ti???n: </h5>
            <p>{formatter.format(totalPrice)}</p>
          </div>

          <div className="price-item">
            <h5>Ph?? v???n chuy???n: </h5>
            <p>{formatter.format(transportFee)}</p>
          </div>

          <div className="price-item">
            <h5>Khuy???n m??i: </h5>
            <p>{formatter.format(promotionalPrice)}</p>
          </div>
          <hr></hr>
          <div className="price-item">
            <h4>T???ng ti???n: </h4>
            <h4>{formatter.format(finalPrice)}</h4>
          </div>

          <p className="receipt-note">
            <i>
              H??ng gi???m gi?? kh??ng h??? tr??? ?????i - tr???.
              <br></br> M???i khi???u n???i giao nh???m/ thi???u s???n ph???m, Luxy Wine ch???
              h??? tr??? khi b???n cung c???p video t??? khi m??? h???p t???i m??? s???n ph???m b??n
              trong kh??ng b??? c???t ??o???n. Xin c???m ??n!
            </i>
          </p>

          <div className="button-group">
            <div className="input-voucher">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type={"text"}
                placeholder="M?? gi???m gi??"
              />
              <button
                onClick={handleCheckPromotion}
                className="btn-buy"
                type="button"
              >
                ??p d???ng
              </button>
            </div>
            <button
              className="order-btn"
              type="submit"
              onClick={() =>
                setTotalPrice(totalPrice + transportFee - promotionalPrice)
              }
            >
              ?????t h??ng
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
export { ReceiptBrefing };
