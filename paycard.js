

  const appState = {};


  const formatAsMoney = (amount, buyerCountry)=>{
    for(let val of countries){
      if (buyerCountry===val.country){
        return (amount.toLocaleString('en-'+val.code, {style:'currency', currency:val.currency}));
      }
    }
    return (amount.toLocaleString('en-US', {style:'currency', currency:'USD'}));
  };

  //flagIfInvalid()
  const flagIfInvalid = (field, isValid)=>{
    if(isValid){
      field.classList.remove('is-invalid');
    }
    else{
      field.classList.add('is-invalid');
    }
  };

  const expiryDateFormatIsValid=(target)=>{
    if (target.value.match(/^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/i)){
      return true;
    }
    else{
      return false;
    }
  };



  //detectCardTYpe
  const detectCardType=({target})=>{
    const misa = parseInt(4);
    const lisa = parseInt(5);
    if (target.value.startsWith(misa)){
      document.querySelector('[data-credit-card]').classList.add('is-visa');
      document.querySelector('[data-credit-card]').classList.remove('is-mastercard');
      document.querySelector('[data-card-type]').src=supportedCards.visa;
      return 'is-visa';
    }
    else if(target.value.startsWith(lisa))
    {
      document.querySelector('[data-credit-card]').classList.remove('is-visa');
      document.querySelector('[data-credit-card]').classList.add('is-mastercard');
      document.querySelector('[data-card-type]').src=supportedCards.mastercard;
      return 'is-mastercard';
    }

  };


  //validateCardExpiryDate
  const validateCardExpiryDate = ({target})=>{
    const isMatch = expiryDateFormatIsValid(target);
    const edited = '01/'+target.value
    const inputDate = new Date(edited);
    //console.log(inputDate);

    const fullDateToday= new Date();
    console.log(fullDateToday);

    //check input month greater than today
    const checkMonth = inputDate.getMonth()>fullDateToday.getMonth();

    //check if input year is equal to or greater than current year
    const checkYear = inputDate.getYear()>fullDateToday.getYear();

    //check that given date is greater than today
    const greater = ()=>{
      if( inputDate.getYear()===fullDateToday.getYear() ){
        if(checkMonth){
          return true;
        }
        else{
          return false;
        }
      }
      else if(checkYear){
        return true;
      }
      else{
        return false;
      }
    };


    if( (greater()) && isMatch){
      flagIfInvalid(target, true);
      return true;
    }
    else{
      flagIfInvalid(target, false);
      return false;
    }
  };

  //validateCardHolderName
  const validateCardHolderName = ({target})=>{
    const name =target.value.split(' ');
    if (name.length==2){
      if(name[0].length>=3 && name[1].length>=3){
        flagIfInvalid(target, true);
        return true;
      }
    }
    else{
      flagIfInvalid(target, false);
      return false;
    }
  };


  //validateWithLuhn
  const validateWithLuhn=(digits)=>{
    if(digits.length != 16){
      return false;
    }

    /*if(!(!digits.some(i => !Number.isInteger(i)))){
      return false;
    } */
    const double = digits.reverse().map((num, index)=>(index%2 ==1)? num*2:num);

    const checkHighValue = double.map(num => (num>9)? num-9: num);

    const getSum = checkHighValue.reduce((sum, num)=> sum+num, 0);

    return(getSum%10 == 0);
  };

  //validateCardNumber
  const validateCardNumber=()=>{
    const digits=[];
    const cardNumbers = document.querySelectorAll('[data-cc-digits] input');

    for(let num of cardNumbers){
      for(let char of num.value){
        digits.push(char);
      }
    }
    const i</script>ntDigits = digits.map(num => (parseInt(num)!=NaN)? parseInt(num):num);
    const validity = validateWithLuhn(intDigits);

    if (validity){
      document.querySelector('[data-cc-digits]').classList.remove('is-invalid');
    }
    else{
      document.querySelector('[data-cc-digits]').classList.add('is-invalid');
    }

    return validity;
  }



  //uiCanInteract
  const uiCanInteract=()=>{
    //console.log(document.query)
    document.querySelector('[data-cc-digits] input:nth-child(1)').addEventListener('blur',detectCardType);

    document.querySelector('[data-cc-info] input:nth-child(1)').addEventListener('blur', validateCardHolderName);

    document.querySelector('[data-cc-info] input:nth-child(2)').addEventListener('blur', validateCardExpiryDate);

    document.querySelector('[data-pay-btn]').addEventListener('click', validateCardNumber);

    document.querySelector('[data-cc-digits] input:nth-child(1)').focus();
  };

  //display cart total
  const displayCartTotal=({results})=>{
    const [data] = results;
    const {itemsInCart, buyerCountry} = data;
    appState.items = itemsInCart;
    appState.country = buyerCountry;
    //console.log(itemsInCart);
    appState.bill = itemsInCart.reduce((tot, {price, qty})=>tot +(price*qty), 0);
    console.log(appState.bill)
    appState.billFormatted = formatAsMoney(appState.bill, appState.country);
    document.querySelector('[data-bill]').textContent=appState.billFormatted;


    //test
    console.log(document.querySelector('[data-cc-digits] input:nth-child(2)'));
    uiCanInteract();
  };


  //fetchBill function
  const fetchBill=()=>{
    const api = 'https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c';
    fetch(api)
      .then (response =>response.json())
      .then(data => displayCartTotal(data))
    .catch(error => console.log(error));
  };

  //setting the text content of


  const supportedCards = {
    visa, mastercard
  };

  const countries = [
    {
      code: "US",
      currency: "USD",
      country: 'United States'
    },
    {
      code: "NG",
      currency: "NGN",
      country: 'Nigeria'
    },
    {
      code: 'KE',
      currency: 'KES',
      country: 'Kenya'
    },
    {
      code: 'UG',
      currency: 'UGX',
      country: 'Uganda'
    },
    {
      code: 'RW',
      currency: 'RWF',
      country: 'Rwanda'
    },
    {
      code: 'TZ',
      currency: 'TZS',
      country: 'Tanzania'
    },
    {
      code: 'ZA',
      currency: 'ZAR',
      country: 'South Africa'
    },
    {
      code: 'CM',
      currency: 'XAF',
      country: 'Cameroon'
    },
    {
      code: 'GH',
      currency: 'GHS',
      country: 'Ghana'
    }
  ];

  const startApp = () => {
    fetchBill();
  };

  startApp();
