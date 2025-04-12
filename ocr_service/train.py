import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model
from datasets import load_dataset

# Load Pretrained DeepSeek Model
MODEL_NAME = "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, torch_dtype=torch.float16, device_map="auto")

# Load Custom Dataset
dataset = load_dataset("json", data_files="dataset.jsonl", split="train")

# Tokenize Data
def tokenize_function(example):
    return tokenizer(f"Extract structured data:\n{example['input']}\nOutput:\n{example['output']}", truncation=True, padding="max_length", max_length=512)

dataset = dataset.map(tokenize_function, batched=True)

# Apply LoRA Fine-Tuning
lora_config = LoraConfig(
    r=16, lora_alpha=32, lora_dropout=0.05, bias="none", task_type="CAUSAL_LM"
)
model = get_peft_model(model, lora_config)

# Training Arguments
training_args = TrainingArguments(
    per_device_train_batch_size=2,
    num_train_epochs=3,
    logging_dir="./logs",
    output_dir="./fine_tuned_deepseek",
    save_steps=500,
    evaluation_strategy="no"
)

# Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
)

# Start Training
trainer.train()

# Save Fine-Tuned Model
model.save_pretrained("./fine_tuned_deepseek")
tokenizer.save_pretrained("./fine_tuned_deepseek")
print("✅ Fine-tuned model saved in fine_tuned_deepseek/")