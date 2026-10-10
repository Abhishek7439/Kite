import time
import os
from selenium import webdriver
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.common.by import By

screenshots_dir = r"d:\Projects\DBMS Project\Kite\project_screenshots"
os.makedirs(screenshots_dir, exist_ok=True)

options = EdgeOptions()
options.add_argument("--headless")
options.add_argument("--window-size=1440,900")
options.add_argument("--disable-gpu")

driver = webdriver.Edge(options=options)

def take_shot(filename, title):
    path = os.path.join(screenshots_dir, filename)
    driver.save_screenshot(path)
    print(f"[{title}] saved to: {path}")
    return path

def safe_click(element):
    driver.execute_script("arguments[0].click();", element)

try:
    # 1. Sign In Page
    driver.get("http://localhost:5173/sign-in")
    time.sleep(2)
    take_shot("01_Sign_In_Page.png", "Sign In Page")

    # 2. Sign Up Page
    driver.get("http://localhost:5173/sign-up")
    time.sleep(2)
    take_shot("02_Sign_Up_Page.png", "Sign Up Page")

    # 3. Create User Account
    print("Filling sign-up form...")
    uname_el = driver.find_element(By.ID, "uname")
    email_el = driver.find_element(By.ID, "email")
    pass_el = driver.find_element(By.ID, "pass")
    repass_el = driver.find_element(By.ID, "repass")

    import random
    suffix = random.randint(1000, 9999)
    username = f"kite_user_{suffix}"
    email = f"user_{suffix}@kite.com"

    uname_el.send_keys(username)
    email_el.send_keys(email)
    pass_el.send_keys("password123")
    repass_el.send_keys("password123")

    signup_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'sign up')]")
    safe_click(signup_btn)
    time.sleep(3)

    # 4. Home Page (LoggedIn)
    take_shot("03_Home_Feed.png", "Home Feed")

    # 5. Create a Text Post
    print("Opening Create Post modal...")
    create_btn = driver.find_element(By.XPATH, "//div[contains(., 'Create') and contains(@class, 'm-2')]")
    safe_click(create_btn)
    time.sleep(2)

    take_shot("04_Create_Post_Modal.png", "Create Post Modal")

    # Enter text in textarea
    text_area = driver.find_element(By.ID, "Text")
    text_area.send_keys("Hello Kite Community! 🪁 Excited to launch our DBMS Social Media Project built with React, Flask & MySQL.")
    
    # Click Public option
    public_btn = driver.find_element(By.XPATH, "//div[text()='Public']")
    safe_click(public_btn)
    time.sleep(1)

    # Click Save button
    save_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Save')]")
    safe_click(save_btn)
    time.sleep(3)

    take_shot("05_Home_Feed_With_Post.png", "Home Feed with Post")

    # 6. Profile Page
    print("Navigating to Profile...")
    profile_btn = driver.find_element(By.XPATH, "//div[contains(., 'Profile') and contains(@class, 'm-2')]")
    safe_click(profile_btn)
    time.sleep(2)
    take_shot("06_Profile_Page.png", "Profile Page")

    # 7. Edit Profile Modal
    print("Opening Edit Profile modal...")
    edit_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Edit Profile')]")
    safe_click(edit_btn)
    time.sleep(2)
    take_shot("07_Edit_Profile_Modal.png", "Edit Profile Modal")

    # Fill bio & real name
    rname_el = driver.find_element(By.ID, "ERname")
    bio_el = driver.find_element(By.ID, "EBio")
    rname_el.clear()
    rname_el.send_keys("DBMS Explorer")
    bio_el.clear()
    bio_el.send_keys("Passionate about Databases & Full-Stack Dev!")

    # Close modal
    close_btn = driver.find_element(By.XPATH, "//span[contains(text(), 'Close')]")
    safe_click(close_btn)
    time.sleep(1)

    take_shot("08_Profile_Page_After_Edit.png", "Profile Page After Edit")

    # 8. Search Drawer
    print("Opening Search Drawer...")
    search_btn = driver.find_element(By.XPATH, "//div[contains(., 'Search') and contains(@class, 'm-2')]")
    safe_click(search_btn)
    time.sleep(1)

    search_input = driver.find_element(By.ID, "searchBar")
    search_input.send_keys("kite")
    time.sleep(2)
    take_shot("09_Search_Drawer.png", "Search Drawer")

    # Close search drawer
    safe_click(search_btn)
    time.sleep(1)

    # 9. More Menu & Saved Posts
    print("Opening More Menu...")
    more_btn = driver.find_element(By.XPATH, "//div[contains(., 'More') and contains(@class, 'm-2')]")
    safe_click(more_btn)
    time.sleep(1)
    take_shot("10_More_Menu.png", "More Menu")

    saved_btn = driver.find_element(By.XPATH, "//div[contains(., 'Saved') and contains(@class, 'm-2')]")
    safe_click(saved_btn)
    time.sleep(2)
    take_shot("11_Saved_Posts_Page.png", "Saved Posts Page")

    print("All screenshots captured successfully!")

except Exception as e:
    print(f"Error during screenshot capture: {e}")
    take_shot("error_state.png", "Error State")

finally:
    driver.quit()
