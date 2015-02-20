(function(){
    var default_settings = {
    };

	var counter = 0;

    var Unit = function(){
	    this.id = '#' + counter;
	    this.parent;
	    this.connections = [];
        //console.log('universe.unit.construct', this.id);
    };
    
    Unit.prototype.init = function(settings){
        console.log('universe.unit.init');
        this.settings = O.extend({}, default_settings, settings);


        return this;
    };

	Unit.prototype.broadcast = function(message, ttl){
		ttl = ttl || 0;
		
		message = message || {
			signatures: [],
			ttl: 0
		};
		
		if(message.signatures.indexOf(this) >= 0){
			return undefined;
		}
		
		message.signatures.push(this);
		
		if(message.ttl > 10){
			return undefined;
		}
		
		message.ttl++;
		
		var structure = {
			
		};
		
		for(var i = 0;i < this.connections.length;i++){
			var unit = this.connections[i];
			if(message.signatures.indexOf(unit) === -1){
				structure[unit.id] = unit.broadcast(message, ttl + 1);
			}
		}
		
		//console.log(this.id, message);
		
		return structure;
	};

    Unit.prototype.connect = function(unit, root){
	    if(this.connections.indexOf(unit) >= 0){
		    return this;
	    }
	    
	    if(this.root === undefined){
		    this.root = root;
	    }
	    
	    this.connections.push(unit);	
		unit.connect(this, this.root);

        return this;
    };
    
    Unit.prototype.disconnect = function(unit){
	    if(this.connections.indexOf(unit) >= 0){
		    for(var i = 0;i < this.connections.length;i++){
			    if(this.connections[i] === unit){
				    this.connections.splice(i, 1);
			    }
		    }
		    
		    unit.disconnect(this);
	    }
	    
	    if(this.connections.length === 0){
		    this.root = undefined;
	    }
	    
	    return this;
    };

    O.set('universe.unit', Unit);
})(O);