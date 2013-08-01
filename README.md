##Swift video store

#Rest API curl examples
```
curl -v -X POST -d '{"title":"Hey look at this", "to":
"bryan@comcast.net", "from": "test@comcast.net"}' -H 'Content-type:
application/json' "http://10.253.24.165:4000/asset"

responseJSON:
{
  "success": "asset created",
    "id": "51f818e8129491ea41000001"
}


curl -v -X PUT -d @test/assets/video.mp4 --header "Content-Type:
video/mp4" --header "Transfer-Encoding: chunked"
"http://10.253.24.165:4000/asset/51f674d8afa9f98a0f000001/video"
200 OK

curl -v -X PUT -d @test/assets/thumb.jpg --header "Content-Type:
image/jpeg" --header "Transfer-Encoding: chunked"
"http://10.253.24.165:4000/asset/51f674d8afa9f98a0f000001/thumb"
200 OK

```

