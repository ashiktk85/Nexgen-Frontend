import React, { useMemo } from "react";
import { Autocomplete, TextField } from "@mui/material";

/**
 * Searchable country / state / city select.
 * Options are filtered as the user types.
 */
const SearchablePlaceSelect = ({
  options = [],
  value = null,
  onChange,
  onBlur,
  getOptionLabel = (o) => (typeof o === "string" ? o : o?.name || ""),
  isOptionEqualToValue,
  placeholder = "Search...",
  disabled = false,
  freeSolo = false,
  error = false,
  size = "small",
  disablePortal = true,
  filterOptions,
  renderOption,
  onInputChange,
  sx,
  TextFieldProps = {},
  id,
  ...rest
}) => {
  const equalToValue = useMemo(() => {
    if (isOptionEqualToValue) return isOptionEqualToValue;
    return (a, b) => {
      if (a == null || b == null) return a === b;
      if (typeof a === "string" || typeof b === "string") {
        return getOptionLabel(a) === getOptionLabel(b);
      }
      if (a.isoCode && b.isoCode) return a.isoCode === b.isoCode;
      return getOptionLabel(a) === getOptionLabel(b);
    };
  }, [getOptionLabel, isOptionEqualToValue]);

  return (
    <Autocomplete
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onInputChange={onInputChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={equalToValue}
      disabled={disabled}
      freeSolo={freeSolo}
      disablePortal={disablePortal}
      autoHighlight
      clearOnEscape
      filterOptions={filterOptions}
      renderOption={renderOption}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          backgroundColor: "#fff",
          fontSize: 13.5,
          fontFamily: "'DM Sans', sans-serif",
        },
        ...sx,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size={size}
          variant="outlined"
          placeholder={placeholder}
          error={error}
          {...TextFieldProps}
        />
      )}
      {...rest}
    />
  );
};

export default SearchablePlaceSelect;
