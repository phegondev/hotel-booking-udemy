import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";


const HomePage = () => {

    const [roomSearchResult, setRoomSearchResult] = useState([]);

    //funtion to handle search result
    const handleSearchResult = (results) => {
        setRoomSearchResult(results);
        console.log("ReSILT IS: " + results)
    }


    return(
        <div className="home">
            <section>
                <header className="header-banner">
                    <img src="./images/bg.jpg" alt="Hotel" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>Welcome to <span className="phegon-color">Phegon Hotel</span></h1> <br/>
                        <h3>Step into a haven of comfort and care</h3>
                    </div>
                </header>
            </section>

            <RoomSearch handSearchResult={handleSearchResult}/>
            <RoomResult roomSearchResults={roomSearchResult}/>

            <h4><a className="view-rooms-home" href="/rooms">All Rooms</a></h4>

            <h2 className="home-services">Services at <span className="phegon-color">Phegon Hotel</span></h2>

            {/* SERVICES SECTION */}
            <section className="service-section"><div className="service-card">
                <img src="./images/ac.png" alt="Air Conditioning" />
                <div className="service-details">
                    <h3 className="service-title">Air Conditioning</h3>
                    <p className="service-description">Stay cool and comfortable throughout your stay with our individually controlled in-room air conditioning.</p>
                </div>
            </div>
                <div className="service-card">
                    <img src="./images/mini-bar.png" alt="Mini Bar" />
                    <div className="service-details">
                        <h3 className="service-title">Mini Bar</h3>
                        <p className="service-description">Enjoy a convenient selection of beverages and snacks stocked in your room's mini bar with no additional cost.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/parking.png" alt="Parking" />
                    <div className="service-details">
                        <h3 className="service-title">Parking</h3>
                        <p className="service-description">We offer on-site parking for your convenience . Please inquire about valet parking options if available.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./images/wifi.png" alt="WiFi" />
                    <div className="service-details">
                        <h3 className="service-title">WiFi</h3>
                        <p className="service-description">Stay connected throughout your stay with complimentary high-speed Wi-Fi access available in all guest rooms and public areas.</p>
                    </div>
                </div>



            </section>
        </div>
    )


}

export default HomePage
