import { useState } from "react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LocationDropdown from "@/components/ui/LocationDropdown";
import { Toggle } from "@/components/ui/toggle";

export default function DepositForm() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [locationId, setLocationId] = useState("");
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [loading, setLoading] = useState(false);

  // start POS “on” by default
  const [isPos, setIsPos] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalDescription = selectedLocationName
        ? `${selectedLocationName}: ${description}`
        : description;

      await api.post("/operations/deposit", {
        amount: parseFloat(amount),
        description: finalDescription,
        locationId: locationId ? parseInt(locationId) : null,
        type: "deposit",
        is_pos: isPos, // 🔥 this will now be true/false correctly
      });

      alert("Scarico avvenuto con successo");
      setAmount("");
      setDescription("");
      setLocationId("");
      setSelectedLocationName("");
    } catch {
      alert("Errore durante lo scarico");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">Effettua uno scarico</h2>

      <Input
        type="number"
        placeholder="Importo"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <Input
        type="text"
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <LocationDropdown
        value={locationId}
        onChange={setLocationId}
        onSelectLocation={(loc) => setSelectedLocationName(loc?.name ?? "")}
      />

      <div className="flex items-center space-x-2">
        <label htmlFor="pos-toggle" className="text-sm">
          POS Transaction
        </label>
        <Toggle
          id="pos-toggle"
          checked={isPos}
          onChange={setIsPos}
          className="transition-all duration-200 ease-in-out"
        />
      </div>

      <Button
        variant="outline"
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-900 text-white"
      >
        {loading ? "Processing..." : "Effettua Scarico"}
      </Button>
    </form>
  );
}
