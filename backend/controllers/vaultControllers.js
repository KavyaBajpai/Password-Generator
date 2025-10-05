import User from "../models/User.js";
import VaultItem from "../models/Vault.js";

export const addVaultItem = async (req, res) => {
    const { userId, name, email } = req.user;

    try {
        const { siteName, password } = req.body;
        if (!siteName || !password)
            return res.status.json({ message: "All fields required." });
        const newItem = await VaultItem.create({
            userId,
            siteName,
            hashedPassword,
            createdAt
        });

        return res.status(201).json({
            message: "Password saved successfully",
            item: newItem,
        });
    }
    catch (error) {
         console.error("Error adding vault item:", err);
        return res.status(500).json({ message: "Server error", deatils: err.message });
    }
}


export const getVaultItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await VaultItem.find({ userId }).sort({ createdAt: -1 });
    return res.status(201).json({message: "Passowrds fetched successfully.", items});
  } 
  catch (err) {
    console.error("Error fetching vault items:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const editVaultItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { siteName, hashedPassword } = req.body;

    const item = await VaultItem.findOne({ _id: id, userId });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (siteName) item.siteName = siteName;
    if (hashedPassword) item.hashedPassword = hashedPassword;

    await item.save();

    return res.status(201).json({ message: "Vault item updated successfully", item });
  } catch (err) {
    console.error("Error editing vault item:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteVaultItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const item = await VaultItem.findOneAndDelete({ _id: id, userId });
    if (!item) return res.status(404).json({ message: "Item not found" });

    return res.status(201).json({ message: "Vault item deleted successfully" });
  } 
  catch (err) {
    console.error("Error deleting vault item:", err);
    res.status(500).json({ message: "Server error" });
  }
};