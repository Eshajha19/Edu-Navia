from compress_pickle import dump, load

# Load your existing model
print("🔄 Loading models.pkl ...")
model_data = load("models.pkl")

# Compress with LZ4
print("📦 Compressing to models.lz4 ...")
dump(model_data, "models.lz4", compression="lz4")

print("✔ Compression complete! models.lz4 created in current folder.")
