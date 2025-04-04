SRCS := $(wildcard src/*.cc)
CXXFLAGS := -std=c++17 -Wall -Wextra -pedantic -Weffc++ -Wold-style-cast -fmax-errors=3 -g
COMMON_DIR = ./common
BUILD_DIR := ./build
EXEC := stefan

OBJS := $(SRCS:%=$(BUILD_DIR)/%.o)

COMMON := $(wildcard $(COMMON_DIR)/*.c $(COMMON_DIR)/Linux/*.c)
COMMON_OBJ := $(COMMON:%=$(BUILD_DIR)/%.o)

INCL := -Isrc/inc/ -I$(COMMON_DIR)/ -I$(COMMON_DIR)/Linux
LDFLAGS := -DGL_GLEXT_PROTOTYPES -lX11 -lGL -lm


$(BUILD_DIR)/%.c.o: %.c
	mkdir -p $(dir $@)
	gcc -Wall $(INCL) -c $< -o $@ $(LDFLAGS)

$(BUILD_DIR)/%.cc.o: %.cc
	mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(INCL) -c $< -o $@ $(LDFLAGS)

$(EXEC): $(OBJS) $(COMMON_OBJ)
	$(CXX) $(CXXFLAGS) $(INCL) $^ -o $@ $(LDFLAGS)

.PHONY: clean
clean:
	rm -r $(BUILD_DIR)
