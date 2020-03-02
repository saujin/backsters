(function(window, document, undefined) {

	var strv = window.strv = {
		base: {},
		fn: {}
	};

	strv.fn.init = function() {
		strv.base.window = $(window);
		strv.base.document = $(document);
		strv.base.html = $("html");
		strv.base.body = $("body");
		strv.base.overlay = $(".overlay");
	};

	strv.fn.modal = function(){
		strv.base.overlay.on("click", function(event){
			strv.base.body.removeClass("fixed");
			strv.base.overlay.fadeOut();
			event.preventDefault();
		});

		strv.base.overlay.find("form").on("click", function(event){
			event.stopPropagation();
		});
	}

	strv.fn.formFunctionality = function(){
		$(".form-generic input, .form-generic textarea, .form-generic select").not(":input[type=submit], :input[type=hidden]").each(function(){
			if ($(this).is("select")){
				var value = $(this).find("option:first-child").text();
			} else if ($(this).is("textarea")){
				var value = $(this).attr("title");
			} else {
				var value = $(this).attr("placeholder");
			}

			$(this).before("<label>" + value + "</label>");

			if($(this).val() == ''){
				$(this).prev().css("visibility", "hidden");
			} else {
				$(this).prev().css("visibility", "visible");
			}

			$(this).on("focus", function(){
				$(this).prev().addClass("active");
			}).on("blur", function(){
				$(this).prev().removeClass("active");
			});

			$(this).keyup(function(){
				if($(this).val() == ''){
					$(this).prev().css("visibility", "hidden");
				} else {
					$(this).prev().css("visibility", "visible");
				}
			});
		});
	}


	strv.fn.formFlowValidation = function(){
		$(".form-apply, .form-signup").validate({
			rules: {
				"email": {
					email: true
				},
				"websiteUrl": {
					url2: true
				},
				"crunchbaseUrl": {
					url2: true
				}
			},
			highlight: function(element, errorClass, validClass) {
				$(element).parents(".field").addClass(errorClass).removeClass(validClass);
				$(element).parents("fieldset").addClass(errorClass).removeClass(validClass);
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).parents(".field").removeClass(errorClass).addClass(validClass);
				$(element).parents("fieldset").removeClass(errorClass).addClass(validClass);
			},
			errorPlacement: function(error, element) {
				return false
			},	
			submitHandler: function(form) {
				var data = $(form).serialize();
				$.ajax({
					url:form.action,
					method:"POST",
					data:data,
					dataType:"json",
					success: function(res){
						if (res.success){
							window.location = $(form).find("[name='nextStep']").val();
						} else {
							strv.fn.serverValidationErrors(res.validationErrors, form);
						}
					},
					error: function(res){
						$(form).before("<pre class='log'>AJAX Error</pre>");
						$(form).before("<pre class='log'>" + res + "</pre>");
					}
				});
				return false;
			}
		});
	}

	

	strv.fn.anchorScroll = function(){
		$(".btn-down, .menu a").not(".mobile-only").click(function(event){
			$("html, body").animate({
				scrollTop: $($.attr(this,"href").replace("/", "")).offset().top
			}, 500);
			event.preventDefault();
		});

		if (window.location.hash) scroll(0,0);
		setTimeout( function() { scroll(0,0); }, 1);
		if(window.location.hash) { 
			$("html, body").animate({
				scrollTop: $(window.location.hash).offset().top
			}, 500);
		}
	}

	strv.fn.selectReplace = function(){
		$("select").select2({
			width:"resolve",
			minimumResultsForSearch:10
		});
	}

	
	strv.fn.serverValidationErrors = function(data, form){

		// initialize container
		if (!$(".server-validation").length){
			$(form).find('input[type=submit]').before('<div class="server-validation"></div>');
		} else {
			$(".server-validation").empty();
		}

		// create error list
		var $errorContainer = $('<ul></ul>');
		$.each(data, function(i) {
			$errorContainer.append('<li class="error">' + data[i].message + '</li>');
		});

		// add validation errors to DOM
		$(".server-validation")
			.append('<label>Form contains errors:</label>')
			.append($errorContainer)
	}

	strv.fn.bindLoginButton = function(){
		$(".modal-login").on("click", function(event){
			strv.base.body.addClass("fixed");
			strv.base.overlay.fadeIn();
			event.preventDefault();
		});
	}

	strv.fn.bindLoginForm = function(form){
		form.validate({
			rules: {
				"username": {
					email: true
				}
			},
			highlight: function(element, errorClass, validClass) {
				$(element).parents(".field").addClass(errorClass).removeClass(validClass);
			},
			unhighlight: function(element, errorClass, validClass) {
				$(element).parents(".field").removeClass(errorClass).addClass(validClass);
			},
			errorPlacement: function(error, element) {
				return false
			},	
			submitHandler: function(form) {
				var data = $(form).serialize();
				$.ajax({
					url:form.action,
					method:"POST",
					data:data,
					dataType:"json",
					success: function(res){
						console.log(res);
						if (res.type == "E_INVALID_EMAIL_PASSWORD"){
							$(form).find('input[type=submit]').before('<div class="server-validation"><label>Form contains errors:</label><div class="error">' + res.message + '</div></div>');
						} else if (res.success){
							if ($(form).data("login-success")){
								$(form).replaceWith('<p class="hero center">' + $(form).data("login-success") + '</p>');
								$(".modal-login").replaceWith(res.userPanel);
							} else {
								$(".close").click();	
								$(".modal-login").replaceWith(res.userPanel);
								strv.fn.bindLogoutForm($(".user-panel"));
							}
						} else {
							strv.fn.serverValidationErrors(res.validationErrors, form);
						}
					},
					error: function(res){
						$(form).before("<pre class='log'>AJAX Error</pre>");
						$(form).before("<pre class='log'>" + res + "</pre>");
					}
				});
				return false;
			}
		});
	}

	strv.fn.bindLogoutForm = function(form){
		form.submit(function(){
			$.ajax({
				url:form.attr("action"),
				method:"POST",
				dataType:"json",
				success: function(res){
					if (res.success){
						/*
						$(".user-panel").replaceWith('<a class="btn btn-stroke modal-login" href="">Log In</a>');
						strv.fn.bindLoginButton();
						strv.fn.bindLoginForm($(".form-login"));
						*/

						setTimeout(function(){
							window.location = "/";
						},1000)
					} else {
						strv.fn.serverValidationErrors(res.validationErrors, form);
					}
				},
				error: function(res){
					$(form).before("<pre class='log'>AJAX Error</pre>");
					$(form).before("<pre class='log'>" + res + "</pre>");
				}
			});
			return false
		});
	}

	strv.fn.addMember = function(){
		$(".link-add").on("click", function(event){
			$(this).hide();
			$(".additional-member").slideDown();
			strv.fn.removeMember();		
			event.preventDefault();
		});
	}

	strv.fn.removeMember = function(){
		$(".link-remove").on("click", function(event){
			$(this).remove();
			$(".additional-member").slideUp();
			$(".link-add").show();
			event.preventDefault();
		});
	}

	strv.fn.addInterest = function() {
		$(".js-add-interest").on("click", function(event) {
			event.preventDefault();

			var interestedBtn = $(this);
			var interestCountSpan = $(".js-interest-count");
			var interestInitial = $(".js-add-interest-initial");
			var interestedResult = $(".js-add-interest-result");

			var companyId = interestedBtn.attr("data-company-id");
			$.post("/api/companies/" + companyId + "/interest").then(function (result) {
				interestCountSpan.text(result.interestCount);
				interestedResult.show();
				interestInitial.remove();
				interestedBtn.remove();
			});
		});
	}

	strv.fn.mobileMenu = function(){
		$(".mobile-menu").on("click", function(event){
			$(this).toggleClass("mobile-menu-active");
			$(".menu").toggle();
			event.preventDefault();
		});
		$(".mobile-menu a").on("click", function(){
			$(".mobile-menu").removeClass("mobile-menu-active");
		});
	}

	strv.fn.domLoad = function(){
		strv.fn.modal();
		strv.fn.formFunctionality();
		strv.fn.formFlowValidation();
		strv.fn.anchorScroll();
		strv.fn.selectReplace();
		strv.fn.bindLoginButton();
		strv.fn.addMember();
		strv.fn.addInterest();
		strv.fn.mobileMenu();

		if ($(".modal-login").length){
			strv.fn.bindLoginForm($(".form-login"));
		}

		if ($(".user-panel").length){
			strv.fn.bindLogoutForm($(".user-panel"));
		}
	};


	/* Runtime
	=======================================*/

	strv.fn.init();

	jQuery(function($) {
		strv.fn.domLoad();
	});


})(window, document);