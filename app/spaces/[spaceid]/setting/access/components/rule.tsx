import POAPAutocomplete from './poapAutocomplete';

const POAP = () => {
  return (
    <div className="p-5">
      <POAPAutocomplete
        initialValue={[184602, 187955]}
        onChange={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
};

const ZuPass = () => {
  return <div className="p-5">ZuPass</div>;
};

export { POAP, ZuPass };
