#!/bin/bash


function startUp () {
	clear;
	echo "wolxXxShellTools: grab containers and their meta.";
	echo "v.0.1 | devops@wolxXx.de | git.wolxxx.de | https://github.com/wolxXx"
	echo "licensed under MIT general public open source license. "
	echo "love it, share it, extend it. improve the world!"
	echo "________________________________________________";
	echo "";
}

function checkRoot () {
	ME=$(whoami);
	if [ ! "root" == $ME ]; then
		echo "you must be root!";
		echo "you are $ME. you rock, sure, but root rocks more ;)";
		echo "";
		exit 1;
	fi;
}

function displayHelp () {
	echo "";
	echo "HELP:";
	echo "no params required!";
	echo "you must be root to run this.";
	echo "this script grabs all containers in /var/lib/lxc";
	echo "and grabs their configuration";
	echo "and writes it into containers.js file";
	echo "for having it in list.html.";
	echo "";
	echo "it does NOT update existing section objects.";
	echo "maybe later. if needed.";
}


startUp;

if [ "$1" == "--help" ]; then
	displayHelp;
	exit 0;
fi;

checkRoot;

here=$(dirname $(readlink -f $0));
cd $here;

if [ ! -e containers.js ]; then
	echo "warning: containers.js does not exist. creaeting now a new one...";
	echo "//containers in /var/lib/lxc" > containers.js;
	echo "" >> containers.js;
	echo "var containers = [];" >> containers.js;

	chmod 777 containers.js;
fi;

CONTAINERS=$(for i in /var/lib/lxc/*; do test -e /var/lib/lxc/$i/config || basename $i; done)
for CONTAINER in $CONTAINERS 
do 
	echo "";
	echo "checking now container: $CONTAINER";
	found=$(cat containers.js | grep "name: '$CONTAINER'");
	if [ ! '' == "$found" ]; then
		echo "found in containers.js";
		continue;
	fi;
	
	echo "not found in containers.js. creating new section.";		
	echo "" >> containers.js;
	echo "//container: $CONTAINER" >> containers.js;
	echo "containers.push({" >> containers.js;
	echo "	name: '$CONTAINER'," >> containers.js;

	ip=$(cat /var/lib/lxc/$CONTAINER/config | grep "ipv4");
	if [ ! '' == "$ip" ]; then
		ip=$(echo $ip | cut -d"=" -f2 | cut -d"/" -f1);
		echo "found configured ip: $ip";
		echo "	ip: '$ip'," >> containers.js;			
	fi;

	mac=$(cat /var/lib/lxc/$CONTAINER/config | grep "hwaddr");
	if [ ! '' == "$mac" ]; then
		mac=$(echo $mac | cut -d"=" -f2);
		echo "found configured mac: $mac";
		echo "	mac: '$mac'," >> containers.js;			
	fi;
	arch=$(cat /var/lib/lxc/$CONTAINER/config | grep "lxc.arch");
	if [ ! '' == "$arch" ]; then
		arch=$(echo $arch | cut -d"=" -f2);
		echo "found configured arch: $arch";
		echo "	arch: '$arch'," >> containers.js;			
	fi;

	echo "});" >> containers.js;
	
done


exit 0;
