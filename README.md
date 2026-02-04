### Universal Scheduling System API

This APP is a Microservices NestJS app.

## Technologies

Here are the technologies used in this project.

- NestJS
- TypeScript
- SQL Server
- Microservices
- Redis
- Prisma


## Dependency

- Pnpm
- Docker
- Docker Compose

* To install all the dependencies:

  > $ sudo pnpm install --frozen-lockfile

* To build the containers:

  > $ sudo docker compose-up


## Project setup

if you installed the dependencies, built the containers and they are ALL running, go to your console and type:

```pnpm start:gateway```

and in another console:

```pnpm start:sched```


## How to use

seed the database with ```pnpm seed```

- get service provider availability in certain weekday where he made his services available, in this example any monday:

<img width="1748" height="877" alt="image" src="https://github.com/user-attachments/assets/a889f594-be71-452c-9ff4-077f9cf0cd5f" />



- lock one of the available slots for a customer:

<img width="1762" height="815" alt="image" src="https://github.com/user-attachments/assets/35816ef5-e766-4d9d-95a7-c47aaa314e36" />



- front end gets real time lock information:

<img width="1750" height="789" alt="image" src="https://github.com/user-attachments/assets/43e18167-336f-49f0-8394-b098f151a3c4" />



- create appointment for locked slot:

<img width="1760" height="725" alt="image" src="https://github.com/user-attachments/assets/ad26afca-3f80-4a4c-a0e9-d536a262100e" />



- front end also get real time information about newly created appointments:

<img width="1739" height="631" alt="image" src="https://github.com/user-attachments/assets/1abf5fd8-f7ec-450d-b791-8a23a5583d54" />


- service provider sees all his appointments from certain date:

<img width="1750" height="836" alt="image" src="https://github.com/user-attachments/assets/0b4a1e68-e213-4d32-87ec-f15c12b20359" />



- same for customer:

<img width="1747" height="831" alt="image" src="https://github.com/user-attachments/assets/92aa0f53-4135-4e86-8188-4bfb72c748a8" />



## Features

The main features of the application are:

Universal scheduling system for service providers and customers with realtime slot locking and appointement information.


## Links

Repository: https://github.com/rubemarjrtech/universal_scheduling_system

In case of sensitive bugs like security vulnerabilities, please contact rubemarrocha22@gmail.com directly instead of using issue tracker. We value your effort to improve the security and privacy of this project!

## Versioning

1.0.0.0

## Authors

Rubemar Rocha de Souza Junior
Please follow github and join us! Thanks to visiting me and good coding!
