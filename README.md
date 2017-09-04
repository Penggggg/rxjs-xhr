
# a Http service for frontend made by rxjs and typescript

## support GET、PUT、POST、DELETE

`http.get<{ name: string }, { id: number }>('/man, { id: 123})`
`.do( res => console.log( res.name ))`
`.subscribe( )`

> node app.js

> localhost:4000

> see console

 ### [ usage ] test.ts

 ### [ origin code ] http-v2.service.ts 