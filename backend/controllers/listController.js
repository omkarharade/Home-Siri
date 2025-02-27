import List from "../model/list.js";
import ListItem from "../model/listItem.js";

// Get or create active list for user
export const getActiveList = async (req, res) => {
	try {
		const { user_id } = req.query;
		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		let [list] = await List.findOrCreate({
			where: {
				user_id,
				status: "active",
			},
			include: [ListItem],
		});

		res.status(200).json({ list });
	} catch (err) {
		res.status(500).json({ message: "Error fetching active list", error: err });
		console.error(err);
	}
};

export const getScheduledLists = async (req, res) => {
	try {
		const { user_id } = req.query;
		if (!user_id) {
			return res.status(400).json({ message: "User ID is required" });
		}

		let list = await List.findAll({
			where: {
				user_id,
				status: "scheduled",
			},
			include: [ListItem],
		});

		res.status(200).json({ list });
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching scheduled list", error: err });
		console.error(err);
	}
};

// Add item to active list
export const addToActiveList = async (req, res) => {
	try {
		const { user_id, product_id, quantity, price, weight, image } = req.body;

		if (!user_id || !product_id || !price) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Get or create active list for user
		let [list] = await List.findOrCreate({
			where: {
				user_id,
				status: "active",
			},
		});

		// Check if item already exists in list
		let listItem = await ListItem.findOne({
			where: {
				list_id: list.id,
				product_id,
			},
		});

		if (listItem) {
			// Update quantity if item exists
			listItem.quantity += quantity || 1;
			await listItem.save();
		} else {
			// Create new list item
			listItem = await ListItem.create({
				list_id: list.id,
				product_id,
				quantity: quantity || 1,
				price,
				weight: weight,
				image: image,
			});
		}

		// Update list total
		const listItems = await ListItem.findAll({ where: { list_id: list.id } });
		const total = listItems.reduce((sum, item) => {
		return sum + parseFloat(item.price) * parseInt(item.quantity);
		}, 0);

		list.total = total;
		await list.save();

		res.status(200).json({
			message: "Item added to list successfully",
			list,
			listItem,
		});
	} catch (err) {
		res.status(500).json({ message: "Error adding item to list", error: err });
		console.error(err);
	}
};

// update list item quantity
export const updateActiveListItem = async (req, res) => {
	try {
		const { list_item_id, quantity } = req.body;

		if (!list_item_id || !quantity) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const listItem = await ListItem.findByPk(list_item_id);
		if (!listItem) {
			return res.status(404).json({ message: "List item not found" });
		}

		listItem.quantity = quantity;
		await listItem.save();

		// Update list total
		const list = await List.findByPk(listItem.list_id);
		const listItems = await ListItem.findAll({ where: { list_id: list.id } });

		const total = listItems.reduce((sum, item) => {
		return sum + parseFloat(item.price) * parseInt(item.quantity);
		}, 0);

		list.total = total;
		await list.save();

		

		res.status(200).json({
			message: "List item updated successfully",
			listItem,
			list,
		});
	} catch (err) {
		res.status(500).json({ message: "Error updating list item", error: err });
		console.error(err);
	}
};

// Remove item from list
export const removeFromActiveList = async (req, res) => {
	try {
		const { list_item_id } = req.params;

		const listItem = await ListItem.findByPk(list_item_id);
		if (!listItem) {
			return res.status(404).json({ message: "List item not found" });
		}

		const list_id = listItem.list_id;
		await listItem.destroy();

		// Update list total
		const list = await List.findByPk(list_id);
		const listItems = await ListItem.findAll({ where: { list_id: list.id } });

		const total = listItems.reduce((sum, item) => {
		return sum + parseFloat(item.price) * parseInt(item.quantity);
		}, 0);

		list.total = total;
		await list.save();

		res.status(200).json({
			message: "Item removed from list successfully",
			list,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error removing item from list", error: err });
		console.error(err);
	}
};

export const updateToScheduledList = async (req, res) => {
	try {
		const scheduleDateTime = req.body.schedule_date_time;
		const address = req.body.address;
		const phoneNumber = req.body.phone;
		const email = req.body.email;

		const activeList = await List.findOne({
			where: {
				status: "active",
			},
		});

		activeList.status = "scheduled";
		activeList.schedule_date_time = scheduleDateTime;
		activeList.phone = phoneNumber;
		activeList.email = email;
		activeList.address = address;


		await activeList.save();

		res.status(200).json({
			message: "List updated to scheduled",
			activeList,
		});
	} catch (err) {
		res.status(500).json({ message: "Error updating list", error: err });
		console.error(err);
	}
};

// clear list
export const clearActiveList = async (req, res) => {
	try {
		
		await ListItem.destroy({
			where: { list_id },
		});

		const list = await List.findByPk(list_id);
		list.total = 0;
		await list.save();

		res.status(200).json({
			message: "List cleared successfully",
			list,
		});
	} catch (err) {
		res.status(500).json({ message: "Error clearing list", error: err });
		console.error(err);
	}
};
