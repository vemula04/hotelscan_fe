// import { menuItems } from '../../../Appconstant';
import './Latest.scss';


export const Latest = () => {
  const menuItems = sessionStorage.tenant_items ? JSON.parse(sessionStorage.tenant_items) : [];
  return (
    <div className='Latest'>
      <section className="section menu" id="menu">
        <div className="menu-container container">
          <div className="menu-content">
            <div className="menu-items">
              {menuItems.map((menuItem, index) => (
                <div className="menu-item flex" key={index}>
                  <img src={menuItem.url} alt="" className="menu-img" />
                  <div className="menuItem-details">
                    <h6 className="menuItem-topic">{menuItem.name}</h6>
                    <p className="menuItem-des">{menuItem.item_desc}</p>
                    <div className='spice'>
                      {[...Array(menuItem.spicy_level)].map((_, index) => (
                        <img key={index} src='https://h-app-scanner.s3.ap-southeast-2.amazonaws.com/img/chilli.png' alt='hi'/>
                      ))}
                    </div>
                  </div>
                  <div className="menuItem-price flex">
                    <span className="discount-price">  {menuItem.currency_code == "AUD" ||
                                  menuItem.currency_code == "US"
                                    ? "$"
                                    : "₹"}{menuItem.promotional_price}</span>
                    <span className="real-price">  {menuItem.currency_code == "AUD" ||
                                  menuItem.currency_code == "US"
                                    ? "$"
                                    : "₹"}{menuItem.item_price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
