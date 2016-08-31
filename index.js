var BASE_YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3';
var GOOGLE_API_KEY = 'AIzaSyDZCyu1khJH700EDxkzxh8an784ALkmhIg';

function loadEvent(newEvent) 
{
	var oldEvent = window.onload;
	if (typeof window.onload != "function")
	{
		window.onload = newEvent;
	}
	else
	{
		oldEvent();
		newEvent();
	}
}

function getHttpResponse(url,callback,errorCallback)
{
	var request = new XMLHttpRequest();
	if (callback)
	{
		request.onreadystatechange = function()
		{
			if (request.readyState === 4)
			{
				if (request.status === 200)
				{
					callback(request);
				}
				else
				{
					errorCallback(request.status);
				}
			}
		}
	}
	request.open("GET",url,!!callback);
	try
	{
		if (request.status === 0 || request.status === 200)
		{
			request.send();
		}
	}
	catch (err)
	{
		if (errorCallback)
		{
			errorCallback(err);
		}
		else
		{
			throw err;
		}
	}
	if (!callback)
	{
		return request.responseText;
	}
}

function displaySearchResults()
{
	var input = document.getElementById("input").value;
	document.getElementById("results").innerHTML = "";
	getHttpResponse(BASE_YOUTUBE_URL + "/search?key=" + GOOGLE_API_KEY + "&part=snippet&type=video&maxResults=10&q=" + input,
	function(request)
	{
		if (request.readyState === 4 && request.status === 200)
		{
			var response = request.responseText;
			var text = JSON.parse(response);
			for (var i = 0; i < text.items.length; i++)
			{
				document.getElementById("results").innerHTML += "<strong><a href ='https://www.youtube.com/watch?v=" + text.items[i].id.videoId + "'>" + text.items[i].snippet.title + "</a></strong><br><br>";
				document.getElementById("results").innerHTML += "<a href = 'https://www.youtube.com/watch?v=" + text.items[i].id.videoId + "'>" + "<img src = '" + text.items[i].snippet.thumbnails.default.url + "'/></a><br><br>";
			}
		}
	},
	function(err)
	{
		document.getElementById("results").innerHTML = "Error";
	});
}

function pressButton()
{
	if (event.keyCode == 13)
	{
		displaySearchResults();
	}
}

document.getElementById("input").addEventListener("keypress", pressButton);
document.getElementById("submit").addEventListener("click", displaySearchResults);