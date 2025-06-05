# Install required packages if not installed
if (!require(keras)) install.packages("keras", repos = "http://cran.us.r-project.org")
if (!require(tensorflow)) install.packages("tensorflow", repos = "http://cran.us.r-project.org")
if (!require(tidyverse)) install.packages("tidyverse", repos = "http://cran.us.r-project.org")

# Load libraries
library(keras)
library(tensorflow)
library(tidyverse)S

# Load the dataset
data <- read.csv("cdc_wonder_data.csv")

# Convert categorical variables into numerical factors
data$State <- as.numeric(as.factor(data$State))
data$Age.Group <- as.numeric(as.factor(data$Age.Group))
data$Sex <- as.numeric(as.factor(data$Sex))
data$Race <- as.numeric(as.factor(data$Race))

# Normalize the Deaths column
data$Deaths <- (data$Deaths - min(data$Deaths)) / (max(data$Deaths) - min(data$Deaths))

# Define function to create time-series sequences for LSTM
create_sequences <- function(data, seq_length) {
  X <- list()
  y <- c()
  
  for (i in 1:(nrow(data) - seq_length)) {
    X[[i]] <- as.matrix(data[i:(i + seq_length - 1), -ncol(data)]) # Features
    y <- c(y, data$Deaths[i + seq_length])  # Target
  }
  
  X <- array(unlist(X), dim = c(length(X), seq_length, ncol(data) - 1))
  y <- array(y, dim = c(length(y), 1))
  
  return(list(X, y))
}

# Define sequence length
seq_length <- 5

# Create training and test sets (80% train, 20% test)
set.seed(123)
train_size <- floor(0.8 * nrow(data))
train_data <- data[1:train_size, ]
test_data <- data[(train_size + 1):nrow(data), ]

train_set <- create_sequences(train_data, seq_length)
test_set <- create_sequences(test_data, seq_length)

X_train <- train_set[[1]]
y_train <- train_set[[2]]

X_test <- test_set[[1]]
y_test <- test_set[[2]]

# Build LSTM model
model <- keras_model_sequential() %>%
  layer_lstm(units = 50, return_sequences = TRUE, input_shape = c(seq_length, ncol(data) - 1)) %>%
  layer_lstm(units = 50, return_sequences = FALSE) %>%
  layer_dense(units = 1)

# Compile the model
model %>% compile(
  loss = 'mse',
  optimizer = optimizer_adam(),
  metrics = c('mae')
)

# Train the model
history <- model %>% fit(
  X_train, y_train,
  epochs = 50,
  batch_size = 16,
  validation_data = list(X_test, y_test),
  verbose = 1
)

# Make predictions
predictions <- model %>% predict(X_test)

# Convert predictions back to original scale
predictions <- predictions * (max(data$Deaths) - min(data$Deaths)) + min(data$Deaths)
y_test_actual <- y_test * (max(data$Deaths) - min(data$Deaths)) + min(data$Deaths)

# Plot actual vs predicted deaths
plot(y_test_actual, type = "l", col = "blue", lwd = 2, xlab = "Time", ylab = "Deaths", main = "Actual vs Predicted Deaths")
lines(predictions, col = "red", lwd = 2)
legend("topright", legend = c("Actual", "Predicted"), col = c("blue", "red"), lwd = 2)

# Print evaluation metrics
score <- model %>% evaluate(X_test, y_test)
print(paste("Test MAE:", round(score$mae, 4)))
