require("dotenv").config();
const express = require("express");
const db	= require("./db");
const cors = require("cors")
const app = express();

app.use(cors());
app.use(express.json());

// get all restaurants
app.get("/api/v1/restaurants", async (req, res) => {
	try{
		const restaurantRatingData = await db.query(
			"SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id")
		res.json({
			status: "success",
			results: restaurantRatingData.rows.length,
			data: {
				restaurants: restaurantRatingData.rows,
			}	
		})
	}catch(e){
		console.log(e);
	}
});

//get a restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const restaurant = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) AS average_rating FROM reviews GROUP BY restaurant_id) reviews ON restaurants.id = reviews.restaurant_id WHERE id = $1", 
		[req.params.id]);
		const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [req.params.id]);
		res.status(200).json({
			status: "success",
			data: {
				restaurant: restaurant.rows[0],
				reviews: reviews.rows,
			}
		});
	} catch (e) {
		console.log(e);
	}
})

//create a restaurant
app.post("/api/v1/restaurants", async (req, res) => {
	try {
		const results = await db.query(
		"INSERT INTO restaurants(name, location, price_range) VALUES($1, $2, $3) RETURNING *", 
		[req.body.name, req.body.location, req.body.price_range]);
		res.status(201).json({
			status: "success",
			data: {
				restaurant: results.rows[0]
			}
		})
	} catch (e) {
		console.log(e);
	}
});

//update restaurant
app.put("/api/v1/restaurants/:id", async (req, res) =>{
	try {
		const results = await db.query(
			"UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *",
			[req.body.name, req.body.location, req.body.price_range, req.params.id]);
		console.log(results)
		res.status(200).json({
			status: "success",
			data: {
				restaurant: results.rows[0]
			}
		});
	} catch (e) {
		console.log(e);
	}
})

//delete restaurant
app.delete("/api/v1/restaurants/:id", async (req, res) => {
	try {
		const results = await db.query(
			"DELETE FROM restaurants WHERE id = $1", 
			[req.params.id]);
		res.status(204).json({
			status: "success"
		})
	} catch (e) {
		console.log(e);
	}
})

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {
	try {
		const newReview = await db.query(
			"INSERT INTO reviews(restaurant_id, name, review, rating) VALUES($1, $2, $3, $4) RETURNING *",
			[req.params.id, req.body.name, req.body.review, req.body.rating]);
		console.log(newReview)
		res.status(201).json({
			status: "success",
			data: {
				review: newReview.rows[0],
			}
		})
	} catch (e) {
		console.log(e);
	}
})

const port = process.env.PORT || 4000;

app.listen(port, () => {
	console.log(`server is listening on port ${port}`);
})