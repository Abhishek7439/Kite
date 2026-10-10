import time
import os
from selenium import webdriver
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By

artifact_dir = r"C:\Users\abhis\.gemini\antigravity-ide\brain\291f4801-70e1-4eb4-8bca-f5e4f4d99469"
screenshots_dir = os.path.join(artifact_dir, "screenshots")
os.makedirs(screenshots_dir, exist_ok=True)

options = EdgeOptions()
options.add_argument("--headless")
options.add_argument("--window-size=1280,800")
options.add_argument("--disable-gpu")

driver = webdriver.Edge(options=options)

try:
    # 1. Sign In Page
    print("Navigating to Sign In page...")
    driver.get("http://localhost:5173/sign-in")
    time.sleep(3)
    signin_path = os.path.join(screenshots_dir, "01_signin_page.png")
    driver.save_screenshot(signin_path)
    print(f"Saved: {signin_path}")

    # 2. Sign Up Page
    print("Navigating to Sign Up page...")
    driver.get("http://localhost:5173/sign-up")
    time.sleep(3)
    signup_path = os.path.join(screenshots_dir, "02_signup_page.png")
    driver.save_screenshot(signup_path)
    print(f"Saved: {signup_path}")

    # 3. Create User / Register
    print("Filling sign-up form...")
    try:
        inputs = driver.find_elements(By.TAG_NAME, "input")
        print(f"Found {len(inputs)} input fields on sign-up page.")
        # Let's inspect placeholders/types or fill standard inputs
        for idx, inp in enumerate(inputs):
            inp_type = inp.get_attribute("type")
            placeholder = inp.get_attribute("placeholder")
            name = inp.get_attribute("name")
            print(f"Input {idx}: type={inp_type}, placeholder={placeholder}, name={name}")

    except Exception as e:
        print(f"Error filling sign up form: {e}")

finally:
    driver.quit()
