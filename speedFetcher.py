import requests

def fetch_typing_speed():
    url = 'https://data.typeracer.com/users?id=tr:yasir_2402&universe=play'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        typing_speed = data['tstats']['wpm']
        return typing_speed
    else:
        return None

if __name__ == "__main__":
    speed = fetch_typing_speed()
    if speed:
        print(speed)
