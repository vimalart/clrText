//This is the validation class

function validator() {
	var self = this;
	
	//Method true if string is empty otherwise false.
	validator.prototype.isEmpty = function(string){
		var result = false;
		if($.trim(string) == "" || 
			$.trim(string) == null || 
			$.trim(string) == false)
				result = true;
		return result; 
	}
	
	//Method compares two string; if matches return true otherwise false.
	validator.prototype.isEquivalent = function(string1, string2){
		var result = false;
		if( $.trim(string1) === $.trim(string2) )
			result = true;
		return result; 
	}
	
	//Method returns true if string is email.
	validator.prototype.isEmail = function(string){
		var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
		return re.test(string);
	}
	



}