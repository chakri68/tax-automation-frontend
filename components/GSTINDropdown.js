import React, { useMemo } from "react";
import { Dropdown } from "semantic-ui-react";

export function GSTINDropdown({ list, onChange, loading }) {
  const options = useMemo(() => {
    return list.map(({ id, gstin, actionRequired, review }) => {
      return {
        key: id,
        text: gstin,
        value: JSON.stringify({
          gstin,
          id,
          actionRequired,
          review,
        }),
      };
    });
  }, [list]);

  return (
    <Dropdown
      placeholder="Select GSTIN"
      fluid
      search
      selection
      loading={loading}
      options={options}
      onChange={(e, { value }) => {
        onChange(JSON.parse(value));
      }}
    />
  );
}

export const MemoizedGSTINDropdown = React.memo(GSTINDropdown);
