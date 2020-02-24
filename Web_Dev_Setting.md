# Development Environment Setting on macOS

- nvm with .nvmrc
- Homebrew
- NGINX
- PHP
- MySQL 5.7
- MariaDB
- Redis
- RabbitMQ


## Install nvm
* All update instruction from this reference link: https://github.com/nvm-sh/nvm


`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash`

`wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash`

use ***zsh*** instead of ***bash*** if use zsh. Then

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

#### Verify Installation

To verify that nvm has been installed, do:

`command -v nvm`

Then install node version with

`nvm install <your node version>`


### Using .nvmrc
This is the process of using a lockdown tool to isolate the dependencies of your node.js app’s specific version.

#### Why is it important?

- Your project is totally locked down and is completely available offline. Thus it is much quicker to install.

- I am going to walk you through a simple process of locking down a Node.js application using `.nvmrc`. I am going to assume that I use Node Version Manager (nvm). In case you are interested in adding this, the `nvm` readme is pretty descriptive, which makes installing the manager straightforward.

#### Using .nvmrc

In your project, create a`.nvmrc` file to add the node version. You can use the `nvm —-help` to check other options. In this tutorial, we are going to use node version 9.4.0.

```
touch .nvmrc
```

- Add this line 9.4.0 to the `.nvmrc` file.
- Afterwards, run the commands below:

```
nvm use
nvm install
nvm exec
nvm run
nvm which
```

- `nvm` use looks for the `.nvmrc` and utilizes it. Remember, no trailing . spaces are allowed. A new line is required.


### Install Homebrew
* Installing Homebrew is effortless, open Terminal and enter :  
 `$  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* **Note:** Homebrew will download and install Command Line Tools for Xcode 8.0 as part of the installation process.

## Additional configuration
### Homebrew

* Install **brew services** first : `$ brew tap homebrew/services`



## Install NGINX
Although Apache is natively included with macOS, we propose here to install Nginx, particularly lightweight and easily configurable.

```
brew install nginx
sudo brew services start nginx
```

Although we musn't use `sudo` with `brew install`, it is necessary to use it to launch Nginx if we want to use the the default port 80.

#### Configuration
We want to store our web site in the folder of our choice, and access to the URL `http://localhost/`. To do this, edit the configuration file:

```
nano /usr/local/etc/nginx/nginx.conf
```

To begin, we will have to give to Nginx the permission to access our files and avoid a nasty `403 Forbidden` error. To do so, we change the first line, where `<user>` is your username:

```
user <user> staff;
```

Then, to add a new website, we will add a new section inside the `http` directive:

```
server {
  listen 80;
  server_name localhost;
  root /Users/<user>/Documents/path/to/your/website;
  index index.html index.htm;
}
```

We then restart Nginx in order to take this changes into account:

`sudo brew services restart nginx`



## PHP

In order to use PHP with Nginx we will use PHP-FPM. Here, we will use PHP 7.2, but you can easily choose any other version:

```
brew install php72
```

Then, we re-edit the configuration file:

`nano /usr/local/etc/nginx/nginx.conf`

We modify the line starting with `index` by:

```
index index.php index.html;
```

Finally, add in the section `server` the following lines to run PHP for all files with the extension `.php`:

```
location ~ \.php {
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
    fastcgi_pass 127.0.0.1:9000;
    fastcgi_split_path_info ^(.+\.php)(/.+)$;
    fastcgi_buffers 16 16k;
    fastcgi_buffer_size 32k;
}
```

To avoid a `File not found`. error, we also need to give the right permissions to PHP. In the following file:

`nano /usr/local/etc/php/7.2/php-fpm.d/www.conf`

Change the following parameter to:

```
user = <user>
group = staff
```

At last, we restart Nginx to activate the changes, and we don’t forget to launch PHP, to avoid a `502 Bad Gateway`:

```
sudo brew services restart nginx
sudo brew services start php72
```



## Install MySQL 5.7
At this time of writing, Homebrew has MySQL version **8** as default, but as we're aiming to get **5.7**, we'll need to append `@5.7` to the default package key:

* Enter the following command : `$ brew info mysql@5.7`  
* Expected output: **mysql@5.7: stable 5.7.22 (bottled) [keg-only]**

To install MySQL enter : `$ brew install mysql@5.7`

* Load and start the MySQL service : `$ brew services start mysql@5.7`.   
Expected output : **Successfully started `mysql` (label: homebrew.mxcl.mysql)** 	  

* Check of the MySQL service has been loaded : `$ brew services list` <sup>[1](#1)</sup>

* Force link 5.7 version - `$ brew link mysql@5.7 --force` 
* Verify the installed MySQL instance : `$ mysql -V`.   
Expected output : **Ver 14.14 Distrib 5.7.22, for osx10.13 (x86_64)**  

Finally, complete the installation by choosing a root password for MySQL:

`mysql_secure_installation`

### MySQL
Open Terminal and execute the following command to set the root password:  
 `mysqladmin -u root password 'yourpassword'`  

> **Important** : Use the single ‘quotes’ to surround the password and make sure to select a strong password! 

### Database Management
To manage your databases, I recommend using [Sequel Pro](http://www.sequelpro.com) or [MySQL Workbench](https://www.mysql.com/products/workbench/), MySQL management tools designed for macOS.   


##### Comments
<a name="1"><sup>1</sup></a> The `brew services start mysql@5.7` - instruction is equal to :   

```
$ ln -sfv /usr/local/opt/mysql/*.plist ~/Library/LaunchAgents
$ launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mysql.plist
```



## Install MariaDB

We will now install and launch MariaDB:
```
brew install mariadb
brew services start mariadb
```

Finally, complete the installation by choosing a root password for MySQL:

`mysql_secure_installation`



## Install Redis

Brew install Redis on Mac

```
brew update
brew install redis
```

To have launchd start redis now and restart at login:
```
brew services start redis
```

Or, if you don't want/need a background service you can just run:

```
redis-server /usr/local/etc/redis.conf
```

Test if Redis server is running.

```
redis-cli ping
```
If it replies “PONG”, then it’s ready to go!

Location of Redis configuration file.

```
/usr/local/etc/redis.conf
```

Uninstall Redis and its files.

```
brew uninstall redis
rm ~/Library/LaunchAgents/homebrew.mxcl.redis.plist
```


## Install RabbitMQ

Install RabbitMQ server with:

```
brew install rabbitmq
```

To have launchd start rabbitmq now and restart at login:

`brew services start rabbitmq`

Or, if you don't want/need a background service you can just run:

`rabbitmq-server`

With Homebrew the node and CLI tools will use the logged in user account by default. Using `sudo` is not required.

Management Plugin enabled by default at `http://localhost:15672`

#### Access dashboard
We can access RabbitMQ web dashboard by going to `http://localhost:15672` so, open the link in your favourite browser.

The default username and password is `guest` and `guest` respectively.
