String.prototype.replaceAll = function(find, replace){
	return this.replace(new RegExp(find, 'g'), replace);
};

function sortByNameAsc(a, b){
	return a.name > b.name;
}

function sortByNameDesc(a, b){
	return a.name < b.name;
}

function sortByIpAsc(a, b){
	return a.ip > b.ip;
}

function sortByIpDesc(a, b){
	return a.ip < b.ip;
}

window.addEventListener('load', function(){
	var sortables = document.getElementsByClassName('sort');
	for(var sort in sortables){
		if(false === sortables.hasOwnProperty(sort) || 'object' !== typeof sortables[sort]){
			continue;
		}
		sortables[sort].addEventListener('click', function(){
			var evalCode = "containers = containers.sort(" + this.getAttributeNode('data-sort').nodeValue + ");";
			eval(evalCode);
			ContainerLister.display();
		});
	}
	document.getElementById('filter').addEventListener('keyup', function(){
		filter();
	});

	containers = containers.sort(sortByNameAsc);
	ContainerLister.display();
});

function hideContainer(container){
	document.getElementById('container' + container.name).style.display = 'none';
	document.getElementById('linkFor' + container.name).style.display = 'none';
}

function showContainer(container){
	document.getElementById('container' + container.name).style.display = 'block';
	document.getElementById('linkFor' + container.name).style.display = 'block';
}



function filter(){
	var value = document.getElementById('filter').value;
	if('' === value){
		containers.forEach(function(container){
			showContainer(container);
		});
	}
	containers.forEach(function(container){
		var display = false;
		if(container.name && -1 !== container.name.indexOf(value)){
			display = true;
		}
		if(container.ip && -1 !== container.ip.indexOf(value)){
			display = true;
		}

		if(false === display){
			hideContainer(container);

			return;
		}

		showContainer(container);
	});
}

var ContainerLister = {
	getTop: function(container){
		var result = '<div id="container' + container + '">';
		result += '<a name="' + container + '"></a>';
		result += '<h2>' + container + '</h2>';
		result += '<table>';

		return result;
	},

	getUndefined: function(key){
		return this.getPlain(key, '???');
	},

	getPlain: function(key, value){
		var result = '';
		result += '<tr>';
		result += '<td>';
		result += key;
		result += '</td>';
		result += '<td>';
		result += value;
		result += '</td>';
		result += '</tr>';

		return result;
	},

	getRow: function(key, value){
		if('undefined' === typeof value){
			return this.getUndefined(key);
		}

		if('object' === typeof value){
			var newValue = '';
			if(value.forEach){
				newValue = '<ul>';
				value.forEach(function(value){
					if('object' === typeof value){
						newValue += '<li>';
						for(var fooobar in value){
							newValue += fooobar + ': ' + value[fooobar];
						}
						newValue += '</li>';
						return;
					}
					newValue += '<li>' + value + '</li>';
				});
				newValue += '</ul>';
			}else{
				newValue = '<table>';
				for(var section in value){
					if(false === value.hasOwnProperty(section)){
						continue;
					}
					newValue += this.getRow(section, value[section]);
				}
				newValue += '</table></div>';
			}
			return this.getPlain(key, newValue);
		}

		return this.getPlain(key, value);
	},
	display: function(){
		var that = this;
		document.getElementById('containerLinks').innerHTML = '';
		document.getElementById('lists').innerHTML = '';
		containers.forEach(function(container){
			document.getElementById('containerLinks').innerHTML += '<li id="linkFor' + container.name + '"><a href="#' + container.name + '">' + container.name + '</a></li>';
			var entry = that.getTop(container.name);
			for(var section in container){
				entry += that.getRow(section, container[section]);
			}
			entry += '</table>';

			entry = entry.replaceAll('%%name%%', container.name);
			document.getElementById('lists').innerHTML += entry;
		});

		filter();
	}
};
