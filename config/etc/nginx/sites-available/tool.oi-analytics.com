##
# You should look at the following URL's in order to grasp a solid understanding
# of Nginx configuration files in order to fully unleash the power of Nginx.
# https://www.nginx.com/resources/wiki/start/
# https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
# https://wiki.debian.org/Nginx/DirectoryStructure
#
# Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
##

upstream tileserver {
	server 127.0.0.1:8080;
}

server {
	listen 80 default_server;
	listen [::]:80 default_server;

	# Note: You should disable gzip for SSL traffic.
	# See: https://bugs.debian.org/773332
	#
	# Read up on ssl_ciphers to ensure a secure configuration.
	# See: https://bugs.debian.org/765782
	#
	# Self signed certs generated by the ssl-cert package
	# Don't use them in a production server!
	#
	# include snippets/snakeoil.conf;

	root /var/www/html;

	# Add index.php to the list if you are using PHP
	index index.html

	server_name tool.oi-analytics.com;

	location / {
		# basic authentication - use htpasswd to add users
		auth_basic "Access restricted";
		auth_basic_user_file /etc/nginx/.htpasswd;

		# First attempt to serve request as file, then
		# as directory, then fall back to index.
		try_files $uri $uri/ /index.html;
	}

	location @index {
		add_header Cache-Control "no-store, no-cache, must-revalidate";
		expires 0;
		try_files /index.html =404;
	}

	location /static {
		# basic authentication - use htpasswd to add users
		auth_basic "Access restricted";
		auth_basic_user_file /etc/nginx/.htpasswd;

		# First attempt to serve request as file, then
		# as directory, then fall back to index.
		try_files $uri =404;
		expires 1y;
		access_log off;
		add_header Cache-Control "public";
	}

	location /styles {
		# basic authentication - use htpasswd to add users
		auth_basic "Access restricted";
		auth_basic_user_file /etc/nginx/.htpasswd;

		proxy_pass http://tileserver;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location /data {
		# basic authentication - use htpasswd to add users
		auth_basic "Access restricted";
		auth_basic_user_file /etc/nginx/.htpasswd;

		proxy_pass http://tileserver;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}

	location /fonts {
		# basic authentication - use htpasswd to add users
		auth_basic "Access restricted";
		auth_basic_user_file /etc/nginx/.htpasswd;

		proxy_pass http://tileserver;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}


	listen [::]:443 ssl ipv6only=on; # managed by Certbot
	listen 443 ssl; # managed by Certbot
	ssl_certificate /etc/letsencrypt/live/tool.oi-analytics.com/fullchain.pem; # managed by Certbot
	ssl_certificate_key /etc/letsencrypt/live/tool.oi-analytics.com/privkey.pem; # managed by Certbot
	include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

# Redirect from HTTP to HTTPS
server {
	if ($host = tool.oi-analytics.com) {
		return 301 https://$host$request_uri;
	} # managed by Certbot


	listen 80 ;
	listen [::]:80 ;
	server_name tool.oi-analytics.com;
	return 404; # managed by Certbot
}
