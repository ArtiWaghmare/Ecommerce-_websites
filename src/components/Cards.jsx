


import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cards.css";

const Cards = () => {
  const [data, setData] = useState([]); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false); 
  const observer = useRef();
  const imgRefs = useRef([]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.jsonbin.io/v3/qs/67bc715fe41b4d34e49ab870"
      );
      setData((prev) => [...prev, ...response.data.record]); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

 
  useEffect(() => {
    fetchData();
  }, [page]);

 
  useEffect(() => {
    imgRefs.current = imgRefs.current.slice(0, data.length);

    if (data.length === 0) return;

    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;

            const newImage = new Image();
            newImage.src = src;
            newImage.onload = () => {
              img.src = src;
              img.classList.add("fade-in");
            };

            imgObserver.unobserve(img);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    imgRefs.current.forEach((img) => {
      if (img) imgObserver.observe(img);
    });

    return () => imgObserver.disconnect();
  }, [data]);

  // Infinite Scroll Observer
  const lastCardRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div className="container mt-4">
     
      <div className="row">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="col-md-4"
              ref={index === data.length - 1 ? lastCardRef : null}
            >
              <div className="card shadow-sm mb-4">
                <div className="card-img-container" style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    ref={(el) => (imgRefs.current[index] = el)}
                    data-src={item.imageUrl}
                    src="https://via.placeholder.com/150?text=Loading..."
                    className="card-img-top lazy-load"
                    alt={item.productName || "Product image"}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{item.productName || "No Title"}</h5>
                  <p className="card-text">Price: ₹{item.productPrice || "N/A"}</p>
                  <button className="btn btn-primary">Buy Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No products found</p>
        )}
      </div>

      {loading && <p className="text-center">Loading more products...</p>}
    </div>
  );
};

export default Cards;
