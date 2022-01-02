export const passwordValidator = (password) => {
  if (!password) return "Passcode can't be empty."
  if (password.length < 6) return 'Passcode must be at least 6 digit long.'
  return ''
}

export const nameValidator = (name) => {
  if (!name || name.trim() == "") return "Name can't be empty."
  return ''
}

export const addressValidator = (address) => {
  if (!address || address.trim() == "") return "Address can't be empty."
  return ''
}

export const stageValidator = (stage) => {
  if (stage == -1) return "Please select stage."
  return ''
}

export const emailValidator = (email) => {
  const re = /\S+@\S+\.\S+/
  if (!email) return "Email can't be empty."
  if (!re.test(email)) return 'Ooops! We need a valid email address.'
  return ''
}


export const mobileValidator = (mobile) => {
  if (!mobile) return "Mobile number can't be empty."
  if (mobile.length<10) return 'Ooops! We need a valid mobile number.'
  return ''
}