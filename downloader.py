import requests

headers = {
	"Origin": "http://infinitejukebox.playlistmachinery.com",
	"Referer": "http://infinitejukebox.playlistmachinery.com/?trid=TRORQWV13762CDDF4C",
	"User-Agent": "Mozilla/5.0"
}

#r = requests.get("http://static.echonest.com/audio2/01%20Call%20Me%20Maybe%201.mp3", headers=headers)

urls = [
	"http://static.echonest.com/audio2/Psy%20-%20Gangnam%20Style.mp3",
	"http://static.echonest.com/audio2/03%20-%20Somebody%20That%20I%20Used%20To%20Know.mp3",
	"http://static.echonest.com/audio2/01%20Adele%20-%20Rolling%20In%20The%20Deep.mp3",
	"http://static.echonest.com/audio2/06.Superstition.Talking%20Book.Stevie%20Wonder.mp3"
]

filenames = [
	"gangnam-style.mp3",
	"somebody-that-i-used-to-know.mp3",
	"rolling-in-the-deep.mp3",
	"superstition.mp3"
]

for i in range(0, len(filenames)):
	r = requests.get(urls[i], headers=headers)
	f = open("./songs/" + filenames[i], "wb")
	f.write(r.content)
	f.close()
	print(r.status_code)
